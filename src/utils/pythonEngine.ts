export interface MemoryBox {
  name: string;
  value: string;
  type: 'tuple' | 'list' | 'int' | 'float' | 'str' | 'bool' | 'NoneType';
}

export interface ExecutionResult {
  output: string;
  error: string | null;
  memory: MemoryBox[];
}

// Internal representation to distinguish Python Tuple from Python List in JS
export class PyTuple {
  items: any[];
  constructor(items: any[]) {
    this.items = [...items];
  }
}

export function isPyTuple(val: any): val is PyTuple {
  return val instanceof PyTuple;
}

export function getPyType(val: any): MemoryBox['type'] {
  if (val === null || val === undefined) return 'NoneType';
  if (isPyTuple(val)) return 'tuple';
  if (Array.isArray(val)) return 'list';
  if (typeof val === 'boolean') return 'bool';
  if (typeof val === 'number') {
    return Number.isInteger(val) ? 'int' : 'float';
  }
  return 'str';
}

export function formatPyValue(val: any, topLevelPrint = false): string {
  if (val === null || val === undefined) return 'None';
  if (typeof val === 'boolean') return val ? 'True' : 'False';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'string') {
    if (topLevelPrint) return val;
    return `'${val}'`;
  }
  if (isPyTuple(val)) {
    const inner = val.items.map((item) => formatPyValue(item, false)).join(', ');
    if (val.items.length === 1) {
      return `(${inner},)`;
    }
    return `(${inner})`;
  }
  if (Array.isArray(val)) {
    const inner = val.map((item) => formatPyValue(item, false)).join(', ');
    return `[${inner}]`;
  }
  return String(val);
}

export function pyEquals(a: any, b: any): boolean {
  if (isPyTuple(a) && isPyTuple(b)) {
    if (a.items.length !== b.items.length) return false;
    return a.items.every((item, i) => pyEquals(item, b.items[i]));
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, i) => pyEquals(item, b[i]));
  }
  return a === b;
}

interface PyFunction {
  name: string;
  params: string[];
  bodyLines: { text: string; lineNo: number; indent: number }[];
}

interface SourceLine {
  text: string;
  lineNo: number;
  indent: number;
}

function stripInlineComment(line: string): string {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === "'" && !inDouble && line[i - 1] !== '\\') inSingle = !inSingle;
    else if (ch === '"' && !inSingle && line[i - 1] !== '\\') inDouble = !inDouble;
    else if (ch === '#' && !inSingle && !inDouble) {
      return line.slice(0, i).trimEnd();
    }
  }
  return line.trimEnd();
}

function splitTopLevel(expr: string, delimiter: string): string[] {
  const parts: string[] = [];
  let current = '';
  let depthParen = 0;
  let depthBracket = 0;
  let inSingle = false;
  let inDouble = false;

  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (ch === "'" && !inDouble && expr[i - 1] !== '\\') inSingle = !inSingle;
    else if (ch === '"' && !inSingle && expr[i - 1] !== '\\') inDouble = !inDouble;
    else if (!inSingle && !inDouble) {
      if (ch === '(') depthParen++;
      else if (ch === ')') depthParen--;
      else if (ch === '[') depthBracket++;
      else if (ch === ']') depthBracket--;
      else if (
        depthParen === 0 &&
        depthBracket === 0 &&
        expr.slice(i, i + delimiter.length) === delimiter
      ) {
        parts.push(current.trim());
        current = '';
        i += delimiter.length - 1;
        continue;
      }
    }
    current += ch;
  }
  if (current.trim().length > 0 || expr.endsWith(delimiter)) {
    parts.push(current.trim());
  }
  return parts;
}

function findTopLevelOperator(expr: string, ops: string[]): { index: number; op: string } | null {
  let depthParen = 0;
  let depthBracket = 0;
  let inSingle = false;
  let inDouble = false;

  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (ch === "'" && !inDouble && expr[i - 1] !== '\\') inSingle = !inSingle;
    else if (ch === '"' && !inSingle && expr[i - 1] !== '\\') inDouble = !inDouble;
    else if (!inSingle && !inDouble) {
      if (ch === '(') depthParen++;
      else if (ch === ')') depthParen--;
      else if (ch === '[') depthBracket++;
      else if (ch === ']') depthBracket--;
      else if (depthParen === 0 && depthBracket === 0) {
        for (const op of ops) {
          if (expr.slice(i, i + op.length) === op) {
            return { index: i, op };
          }
        }
      }
    }
  }
  return null;
}

function findLastTopLevelAddSub(expr: string): { index: number; op: '+' | '-' } | null {
  let depthParen = 0;
  let depthBracket = 0;
  let inSingle = false;
  let inDouble = false;
  let found: { index: number; op: '+' | '-' } | null = null;

  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (ch === "'" && !inDouble && expr[i - 1] !== '\\') inSingle = !inSingle;
    else if (ch === '"' && !inSingle && expr[i - 1] !== '\\') inDouble = !inDouble;
    else if (!inSingle && !inDouble) {
      if (ch === '(') depthParen++;
      else if (ch === ')') depthParen--;
      else if (ch === '[') depthBracket++;
      else if (ch === ']') depthBracket--;
      else if (depthParen === 0 && depthBracket === 0 && (ch === '+' || ch === '-')) {
        // Check if unary
        const prev = expr.slice(0, i).trimEnd();
        if (
          prev.length === 0 ||
          prev.endsWith('(') ||
          prev.endsWith('[') ||
          prev.endsWith(',') ||
          prev.endsWith(':') ||
          prev.endsWith('=') ||
          prev.endsWith('<') ||
          prev.endsWith('>') ||
          prev.endsWith('+') ||
          prev.endsWith('-') ||
          prev.endsWith('*') ||
          prev.endsWith('/')
        ) {
          continue;
        }
        found = { index: i, op: ch };
      }
    }
  }
  return found;
}

function isWrappedInMatchingBrackets(expr: string, open: string, close: string): boolean {
  if (!expr.startsWith(open) || !expr.endsWith(close)) return false;
  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (ch === "'" && !inDouble && expr[i - 1] !== '\\') inSingle = !inSingle;
    else if (ch === '"' && !inSingle && expr[i - 1] !== '\\') inDouble = !inDouble;
    else if (!inSingle && !inDouble) {
      if (ch === open) depth++;
      else if (ch === close) {
        depth--;
        if (depth === 0 && i < expr.length - 1) return false;
      }
    }
  }
  return depth === 0;
}

export function runPythonCode(code: string): ExecutionResult {
  const rawLines = code.split(/\r?\n/);
  const lines: SourceLine[] = [];

  // Join multi-line parentheses/brackets automatically
  let buffer = '';
  let bufferLineNo = 1;
  let bufferIndent = 0;
  let openBalance = 0;

  for (let i = 0; i < rawLines.length; i++) {
    const raw = rawLines[i];
    const stripped = stripInlineComment(raw);
    if (!stripped.trim() && openBalance === 0) continue;

    if (openBalance === 0) {
      bufferLineNo = i + 1;
      bufferIndent = raw.search(/\S|$/);
      buffer = stripped.trim();
    } else {
      buffer += ' ' + stripped.trim();
    }

    let inS = false;
    let inD = false;
    for (let c = 0; c < stripped.length; c++) {
      const ch = stripped[c];
      if (ch === "'" && !inD) inS = !inS;
      else if (ch === '"' && !inS) inD = !inD;
      else if (!inS && !inD) {
        if (ch === '(' || ch === '[') openBalance++;
        else if (ch === ')' || ch === ']') openBalance = Math.max(0, openBalance - 1);
      }
    }

    if (openBalance === 0 && buffer.length > 0) {
      lines.push({ text: buffer, lineNo: bufferLineNo, indent: bufferIndent });
      buffer = '';
    }
  }
  if (buffer.length > 0) {
    lines.push({ text: buffer, lineNo: bufferLineNo, indent: bufferIndent });
  }

  const env: Record<string, any> = {};
  const functions: Record<string, PyFunction> = {};
  const outputLines: string[] = [];
  let stepCounter = 0;
  const MAX_STEPS = 2500;

  function raiseTypeError(lineNo: number, lineText: string, message: string): never {
    const err = new Error(
      `Traceback (most recent call last):\n  File "main.py", line ${lineNo}, in <module>\n    ${lineText}\nTypeError: ${message}`
    );
    (err as any).isPyError = true;
    throw err;
  }

  function raiseIndexError(lineNo: number, lineText: string, message: string): never {
    const err = new Error(
      `Traceback (most recent call last):\n  File "main.py", line ${lineNo}, in <module>\n    ${lineText}\nIndexError: ${message}`
    );
    (err as any).isPyError = true;
    throw err;
  }

  function raiseNameError(lineNo: number, lineText: string, name: string): never {
    const err = new Error(
      `Traceback (most recent call last):\n  File "main.py", line ${lineNo}, in <module>\n    ${lineText}\nNameError: name '${name}' is not defined`
    );
    (err as any).isPyError = true;
    throw err;
  }

  function evalExpr(exprStr: string, scope: Record<string, any>, lineNo: number, lineText: string): any {
    const expr = exprStr.trim();
    if (!expr) return null;

    // Boolean & None literals
    if (expr === 'True') return true;
    if (expr === 'False') return false;
    if (expr === 'None') return null;

    // Numeric literals
    if (/^-?\d+(\.\d+)?$/.test(expr)) {
      return Number(expr);
    }

    // String literals
    if (
      (expr.startsWith("'") && expr.endsWith("'") && isWrappedInMatchingBrackets(expr, "'", "'")) ||
      (expr.startsWith('"') && expr.endsWith('"') && isWrappedInMatchingBrackets(expr, '"', '"'))
    ) {
      // Make sure there's no unquoted operator outside
      let singleString = true;
      const quote = expr[0];
      for (let i = 1; i < expr.length - 1; i++) {
        if (expr[i] === quote && expr[i - 1] !== '\\') {
          singleString = false;
          break;
        }
      }
      if (singleString) {
        return expr.slice(1, -1);
      }
    }

    // Logical 'and' / 'or'
    const orMatch = findTopLevelOperator(expr, [' or ']);
    if (orMatch) {
      const left = evalExpr(expr.slice(0, orMatch.index), scope, lineNo, lineText);
      const right = evalExpr(expr.slice(orMatch.index + 4), scope, lineNo, lineText);
      return Boolean(left) || Boolean(right);
    }
    const andMatch = findTopLevelOperator(expr, [' and ']);
    if (andMatch) {
      const left = evalExpr(expr.slice(0, andMatch.index), scope, lineNo, lineText);
      const right = evalExpr(expr.slice(andMatch.index + 5), scope, lineNo, lineText);
      return Boolean(left) && Boolean(right);
    }
    if (expr.startsWith('not ')) {
      return !evalExpr(expr.slice(4), scope, lineNo, lineText);
    }

    // Comparisons
    const cmpMatch = findTopLevelOperator(expr, ['==', '!=', '<=', '>=', '<', '>', ' in ']);
    if (cmpMatch) {
      const left = evalExpr(expr.slice(0, cmpMatch.index), scope, lineNo, lineText);
      const right = evalExpr(expr.slice(cmpMatch.index + cmpMatch.op.length), scope, lineNo, lineText);
      switch (cmpMatch.op) {
        case '==':
          return pyEquals(left, right);
        case '!=':
          return !pyEquals(left, right);
        case '<=':
          return left <= right;
        case '>=':
          return left >= right;
        case '<':
          return left < right;
        case '>':
          return left > right;
        case ' in ': {
          const arr = isPyTuple(right) ? right.items : Array.isArray(right) ? right : [];
          return arr.some((item) => pyEquals(item, left));
        }
      }
    }

    // Addition / Subtraction / Concatenation
    const addSub = findLastTopLevelAddSub(expr);
    if (addSub) {
      const left = evalExpr(expr.slice(0, addSub.index), scope, lineNo, lineText);
      const right = evalExpr(expr.slice(addSub.index + 1), scope, lineNo, lineText);
      if (addSub.op === '+') {
        if (isPyTuple(left) && isPyTuple(right)) {
          return new PyTuple([...left.items, ...right.items]);
        }
        if (Array.isArray(left) && Array.isArray(right)) {
          return [...left, ...right];
        }
        if ((isPyTuple(left) && !isPyTuple(right)) || (!isPyTuple(left) && isPyTuple(right))) {
          raiseTypeError(lineNo, lineText, 'can only concatenate tuple (not "' + getPyType(right) + '") to tuple');
        }
        return left + right;
      } else {
        return left - right;
      }
    }

    // Multiplication / Division / Modulo
    const mulDiv = findTopLevelOperator(expr, ['//', '*', '/', '%']);
    if (mulDiv) {
      const left = evalExpr(expr.slice(0, mulDiv.index), scope, lineNo, lineText);
      const right = evalExpr(expr.slice(mulDiv.index + mulDiv.op.length), scope, lineNo, lineText);
      if (mulDiv.op === '*') {
        if (isPyTuple(left) && typeof right === 'number') {
          const res: any[] = [];
          for (let i = 0; i < right; i++) res.push(...left.items);
          return new PyTuple(res);
        }
        if (Array.isArray(left) && typeof right === 'number') {
          const res: any[] = [];
          for (let i = 0; i < right; i++) res.push(...left);
          return res;
        }
        if (typeof left === 'string' && typeof right === 'number') {
          return left.repeat(Math.max(0, right));
        }
        return left * right;
      }
      if (mulDiv.op === '//') return Math.floor(left / right);
      if (mulDiv.op === '/') return left / right;
      if (mulDiv.op === '%') return left % right;
    }

    // Parenthesized expression or Tuple literal: (...)
    if (isWrappedInMatchingBrackets(expr, '(', ')')) {
      const inner = expr.slice(1, -1).trim();
      if (inner === '') return new PyTuple([]);
      const parts = splitTopLevel(inner, ',');
      if (parts.length > 1 || inner.endsWith(',')) {
        const filtered = inner.endsWith(',') && parts[parts.length - 1] === '' ? parts.slice(0, -1) : parts;
        return new PyTuple(filtered.map((p) => evalExpr(p, scope, lineNo, lineText)));
      }
      return evalExpr(inner, scope, lineNo, lineText);
    }

    // List literal: [...]
    if (isWrappedInMatchingBrackets(expr, '[', ']')) {
      const inner = expr.slice(1, -1).trim();
      if (inner === '') return [];
      const parts = splitTopLevel(inner, ',');
      const filtered = inner.endsWith(',') && parts[parts.length - 1] === '' ? parts.slice(0, -1) : parts;
      return filtered.map((p) => evalExpr(p, scope, lineNo, lineText));
    }

    // Indexing or Slicing: target[index_or_slice] (handle chained like nest_tup[-1][-1])
    if (expr.endsWith(']')) {
      // Find matching '[' for the trailing ']'
      let depth = 0;
      let openIdx = -1;
      let inS = false;
      let inD = false;
      for (let i = expr.length - 1; i >= 0; i--) {
        const ch = expr[i];
        if (ch === "'" && !inD) inS = !inS;
        else if (ch === '"' && !inS) inD = !inD;
        else if (!inS && !inD) {
          if (ch === ']') depth++;
          else if (ch === '[') {
            depth--;
            if (depth === 0) {
              openIdx = i;
              break;
            }
          }
        }
      }
      if (openIdx > 0) {
        const baseExpr = expr.slice(0, openIdx).trim();
        const bracketInner = expr.slice(openIdx + 1, -1).trim();
        const target = evalExpr(baseExpr, scope, lineNo, lineText);
        const isTup = isPyTuple(target);
        const items: any[] = isTup
          ? target.items
          : Array.isArray(target)
          ? target
          : typeof target === 'string'
          ? target.split('')
          : [];

        if (bracketInner.includes(':')) {
          const sliceParts = bracketInner.split(':').map((s) => s.trim());
          const len = items.length;
          const step = sliceParts[2] ? Number(evalExpr(sliceParts[2], scope, lineNo, lineText)) : 1;
          if (step === -1 && !sliceParts[0] && !sliceParts[1]) {
            const rev = [...items].reverse();
            return isTup ? new PyTuple(rev) : typeof target === 'string' ? rev.join('') : rev;
          }
          let start = sliceParts[0] !== '' ? Number(evalExpr(sliceParts[0], scope, lineNo, lineText)) : 0;
          let stop = sliceParts[1] !== '' ? Number(evalExpr(sliceParts[1], scope, lineNo, lineText)) : len;
          if (start < 0) start = Math.max(0, len + start);
          if (stop < 0) stop = Math.max(0, len + stop);
          start = Math.max(0, Math.min(len, start));
          stop = Math.max(0, Math.min(len, stop));
          const sliced: any[] = [];
          for (let idx = start; idx < stop; idx += Math.max(1, step)) {
            sliced.push(items[idx]);
          }
          return isTup ? new PyTuple(sliced) : typeof target === 'string' ? sliced.join('') : sliced;
        } else {
          let idx = Number(evalExpr(bracketInner, scope, lineNo, lineText));
          if (idx < 0) idx = items.length + idx;
          if (idx < 0 || idx >= items.length) {
            raiseIndexError(lineNo, lineText, `${isTup ? 'tuple' : 'list'} index out of range`);
          }
          return items[idx];
        }
      }
    }

    // Method calls: obj.method(args)
    const dotMatch = expr.match(/^([a-zA-Z_]\w*(?:\[[^\]]+\])*)\.([a-zA-Z_]\w*)\((.*)\)$/);
    if (dotMatch) {
      const [, objExpr, methodName, argsRaw] = dotMatch;
      const obj = evalExpr(objExpr, scope, lineNo, lineText);
      const args = argsRaw.trim() ? splitTopLevel(argsRaw, ',').map((a) => evalExpr(a, scope, lineNo, lineText)) : [];
      const arr = isPyTuple(obj) ? obj.items : Array.isArray(obj) ? obj : null;

      if (arr) {
        if (methodName === 'count') {
          return arr.filter((x) => pyEquals(x, args[0])).length;
        }
        if (methodName === 'index') {
          const foundIdx = arr.findIndex((x) => pyEquals(x, args[0]));
          if (foundIdx === -1) raiseTypeError(lineNo, lineText, 'tuple.index(x): x not in tuple');
          return foundIdx;
        }
        if (isPyTuple(obj) && ['append', 'insert', 'remove', 'pop', 'sort', 'reverse', 'extend'].includes(methodName)) {
          raiseTypeError(lineNo, lineText, `'tuple' object has no attribute '${methodName}' (tuples are immutable!)`);
        }
        if (Array.isArray(obj)) {
          if (methodName === 'append') {
            obj.push(args[0]);
            return null;
          }
          if (methodName === 'extend') {
            const ext = isPyTuple(args[0]) ? args[0].items : Array.isArray(args[0]) ? args[0] : [];
            obj.push(...ext);
            return null;
          }
          if (methodName === 'insert') {
            obj.splice(Number(args[0]), 0, args[1]);
            return null;
          }
          if (methodName === 'remove') {
            const idx = obj.findIndex((x) => pyEquals(x, args[0]));
            if (idx !== -1) obj.splice(idx, 1);
            return null;
          }
          if (methodName === 'pop') {
            const idx = args.length > 0 ? Number(args[0]) : obj.length - 1;
            return obj.splice(idx, 1)[0];
          }
          if (methodName === 'sort') {
            obj.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
            return null;
          }
          if (methodName === 'reverse') {
            obj.reverse();
            return null;
          }
        }
      }
    }

    // Function calls: fn(args)
    const fnMatch = expr.match(/^([a-zA-Z_]\w*)\((.*)\)$/);
    if (fnMatch) {
      const [, fnName, argsRaw] = fnMatch;
      if (fnName === 'tuple') {
        const inner = argsRaw.trim();
        if (!inner) return new PyTuple([]);
        // Support Codingal's tuple(10, 20, 30) shorthand AND standard Python tuple([10, 20, 30])
        const argParts = splitTopLevel(inner, ',').map((a) => evalExpr(a, scope, lineNo, lineText));
        if (argParts.length === 1) {
          const single = argParts[0];
          if (isPyTuple(single)) return new PyTuple(single.items);
          if (Array.isArray(single)) return new PyTuple(single);
          if (typeof single === 'string') return new PyTuple(single.split(''));
        }
        return new PyTuple(argParts);
      }
      if (fnName === 'list') {
        const inner = argsRaw.trim();
        if (!inner) return [];
        const single = evalExpr(inner, scope, lineNo, lineText);
        if (isPyTuple(single)) return [...single.items];
        if (Array.isArray(single)) return [...single];
        if (typeof single === 'string') return single.split('');
        return [single];
      }
      const args = argsRaw.trim() ? splitTopLevel(argsRaw, ',').map((a) => evalExpr(a, scope, lineNo, lineText)) : [];
      if (fnName === 'len') {
        const target = args[0];
        if (isPyTuple(target)) return target.items.length;
        if (Array.isArray(target) || typeof target === 'string') return target.length;
        return 0;
      }
      if (fnName === 'max') {
        const items = args.length === 1 && (isPyTuple(args[0]) || Array.isArray(args[0]))
          ? (isPyTuple(args[0]) ? args[0].items : args[0])
          : args;
        return Math.max(...items);
      }
      if (fnName === 'min') {
        const items = args.length === 1 && (isPyTuple(args[0]) || Array.isArray(args[0]))
          ? (isPyTuple(args[0]) ? args[0].items : args[0])
          : args;
        return Math.min(...items);
      }
      if (fnName === 'sum') {
        const items = isPyTuple(args[0]) ? args[0].items : Array.isArray(args[0]) ? args[0] : [];
        return items.reduce((a: number, b: number) => a + b, 0);
      }
      if (fnName === 'sorted') {
        const items = isPyTuple(args[0]) ? [...args[0].items] : Array.isArray(args[0]) ? [...args[0]] : [];
        return items.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
      }
      if (fnName === 'type') {
        return `<class '${getPyType(args[0])}'>`;
      }
      if (fnName === 'range') {
        const start = args.length === 1 ? 0 : Number(args[0]);
        const stop = args.length === 1 ? Number(args[0]) : Number(args[1]);
        const step = args.length >= 3 ? Number(args[2]) : 1;
        const r: number[] = [];
        for (let k = start; step > 0 ? k < stop : k > stop; k += step) r.push(k);
        return r;
      }
      if (functions[fnName]) {
        const fnDef = functions[fnName];
        const localScope: Record<string, any> = { ...scope };
        fnDef.params.forEach((p, idx) => {
          localScope[p] = args[idx];
        });
        const ret = executeBlock(fnDef.bodyLines, localScope);
        return ret.returned ? ret.value : null;
      }
    }

    // Variable lookup
    if (/^[a-zA-Z_]\w*$/.test(expr)) {
      if (expr in scope) return scope[expr];
      if (expr in env) return env[expr];
      raiseNameError(lineNo, lineText, expr);
    }

    // Implicit comma-separated tuple without outer parens: e.g. a = 1, 2, 3
    const commaParts = splitTopLevel(expr, ',');
    if (commaParts.length > 1) {
      const filtered = expr.endsWith(',') && commaParts[commaParts.length - 1] === '' ? commaParts.slice(0, -1) : commaParts;
      return new PyTuple(filtered.map((p) => evalExpr(p, scope, lineNo, lineText)));
    }

    return null;
  }

  function collectIndentedBlock(blockLines: SourceLine[], startIdx: number, parentIndent: number) {
    const collected: SourceLine[] = [];
    let j = startIdx;
    while (j < blockLines.length && blockLines[j].indent > parentIndent) {
      collected.push(blockLines[j]);
      j++;
    }
    return { collected, nextIdx: j };
  }

  function executeBlock(
    blockLines: SourceLine[],
    scope: Record<string, any>
  ): { returned: boolean; value: any } {
    let i = 0;
    while (i < blockLines.length) {
      stepCounter++;
      if (stepCounter > MAX_STEPS) {
        throw new Error('Execution timed out: loop ran too many times.');
      }

      const lineObj = blockLines[i];
      const stmt = lineObj.text;
      const lineNo = lineObj.lineNo;

      if (stmt === 'pass') {
        i++;
        continue;
      }

      // return statement
      if (stmt === 'return' || stmt.startsWith('return ')) {
        const retExpr = stmt.slice(6).trim();
        const val = retExpr ? evalExpr(retExpr, scope, lineNo, stmt) : null;
        return { returned: true, value: val };
      }

      // Function definition: def name(params):
      const defMatch = stmt.match(/^def\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)\s*:$/);
      if (defMatch) {
        const [, fnName, paramsRaw] = defMatch;
        const params = paramsRaw
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean);
        const { collected, nextIdx } = collectIndentedBlock(blockLines, i + 1, lineObj.indent);
        functions[fnName] = { name: fnName, params, bodyLines: collected };
        i = nextIdx;
        continue;
      }

      // While loop: while cond: or while(cond):
      const whileMatch = stmt.match(/^while\s*(.+)\s*:$/);
      if (whileMatch) {
        const condExpr = whileMatch[1].trim();
        const { collected, nextIdx } = collectIndentedBlock(blockLines, i + 1, lineObj.indent);
        while (Boolean(evalExpr(condExpr, scope, lineNo, stmt))) {
          stepCounter++;
          if (stepCounter > MAX_STEPS) {
            throw new Error('Infinite while loop detected (check your s += 1 and e -= 1 steps!).');
          }
          const res = executeBlock(collected, scope);
          if (res.returned) return res;
        }
        i = nextIdx;
        continue;
      }

      // For loop: for var in iterable:
      const forMatch = stmt.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+(.+)\s*:$/);
      if (forMatch) {
        const [, loopVar, iterExpr] = forMatch;
        const iterableVal = evalExpr(iterExpr.trim(), scope, lineNo, stmt);
        const items = isPyTuple(iterableVal)
          ? iterableVal.items
          : Array.isArray(iterableVal)
          ? iterableVal
          : typeof iterableVal === 'string'
          ? iterableVal.split('')
          : [];
        const { collected, nextIdx } = collectIndentedBlock(blockLines, i + 1, lineObj.indent);
        for (const item of items) {
          scope[loopVar] = item;
          const res = executeBlock(collected, scope);
          if (res.returned) return res;
        }
        i = nextIdx;
        continue;
      }

      // If / elif / else chain
      const ifMatch = stmt.match(/^if\s*(.+)\s*:$/);
      if (ifMatch) {
        const branches: { cond: string | null; body: SourceLine[]; lineNo: number; text: string }[] = [];
        const firstBlock = collectIndentedBlock(blockLines, i + 1, lineObj.indent);
        branches.push({
          cond: ifMatch[1].trim(),
          body: firstBlock.collected,
          lineNo,
          text: stmt,
        });
        let cursor = firstBlock.nextIdx;

        while (cursor < blockLines.length && blockLines[cursor].indent === lineObj.indent) {
          const nextStmt = blockLines[cursor].text;
          const elifMatch = nextStmt.match(/^elif\s*(.+)\s*:$/);
          const elseMatch = nextStmt.match(/^else\s*:$/);
          if (elifMatch) {
            const b = collectIndentedBlock(blockLines, cursor + 1, lineObj.indent);
            branches.push({
              cond: elifMatch[1].trim(),
              body: b.collected,
              lineNo: blockLines[cursor].lineNo,
              text: nextStmt,
            });
            cursor = b.nextIdx;
          } else if (elseMatch) {
            const b = collectIndentedBlock(blockLines, cursor + 1, lineObj.indent);
            branches.push({
              cond: null,
              body: b.collected,
              lineNo: blockLines[cursor].lineNo,
              text: nextStmt,
            });
            cursor = b.nextIdx;
            break;
          } else {
            break;
          }
        }

        for (const branch of branches) {
          if (branch.cond === null || Boolean(evalExpr(branch.cond, scope, branch.lineNo, branch.text))) {
            const res = executeBlock(branch.body, scope);
            if (res.returned) return res;
            break;
          }
        }
        i = cursor;
        continue;
      }

      // print(...) statement
      const printMatch = stmt.match(/^print\s*\((.*)\)$/);
      if (printMatch) {
        const argsRaw = printMatch[1].trim();
        if (!argsRaw) {
          outputLines.push('');
        } else {
          const parts = splitTopLevel(argsRaw, ',');
          const evaluated = parts.map((p) => {
            const v = evalExpr(p, scope, lineNo, stmt);
            return formatPyValue(v, true);
          });
          outputLines.push(evaluated.join(' '));
        }
        i++;
        continue;
      }

      // Augmented assignment: +=, -=
      const augMatch = stmt.match(/^([a-zA-Z_]\w*)\s*(\+=|-=)\s*(.+)$/);
      if (augMatch) {
        const [, varName, op, rhsExpr] = augMatch;
        const current = varName in scope ? scope[varName] : env[varName];
        if (current === undefined) raiseNameError(lineNo, stmt, varName);
        const rhs = evalExpr(rhsExpr, scope, lineNo, stmt);
        if (op === '+=') {
          if (isPyTuple(current) && isPyTuple(rhs)) {
            scope[varName] = new PyTuple([...current.items, ...rhs.items]);
          } else {
            scope[varName] = current + rhs;
          }
        } else {
          scope[varName] = current - rhs;
        }
        i++;
        continue;
      }

      // Indexed assignment: target[idx] = val or target[i][j] = val
      const idxAssignMatch = stmt.match(/^([a-zA-Z_]\w*(?:\[[^\]]+\])*)\[([^\]]+)\]\s*=\s*(.+)$/);
      if (idxAssignMatch) {
        const [, targetExpr, idxExpr, rhsExpr] = idxAssignMatch;
        const container = evalExpr(targetExpr, scope, lineNo, stmt);
        const idxVal = Number(evalExpr(idxExpr, scope, lineNo, stmt));
        const rhsVal = evalExpr(rhsExpr, scope, lineNo, stmt);
        if (isPyTuple(container)) {
          raiseTypeError(lineNo, stmt, "'tuple' object does not support item assignment");
        }
        if (Array.isArray(container)) {
          const actualIdx = idxVal < 0 ? container.length + idxVal : idxVal;
          if (actualIdx < 0 || actualIdx >= container.length) {
            raiseIndexError(lineNo, stmt, 'list assignment index out of range');
          }
          container[actualIdx] = rhsVal;
        }
        i++;
        continue;
      }

      // Tuple unpacking assignment: a, b = b, a
      const assignIdx = findTopLevelOperator(stmt, ['=']);
      if (
        assignIdx &&
        stmt[assignIdx.index - 1] !== '!' &&
        stmt[assignIdx.index - 1] !== '<' &&
        stmt[assignIdx.index - 1] !== '>' &&
        stmt[assignIdx.index + 1] !== '='
      ) {
        const lhs = stmt.slice(0, assignIdx.index).trim();
        const rhs = stmt.slice(assignIdx.index + 1).trim();
        const lhsVars = splitTopLevel(lhs, ',');
        const rhsVal = evalExpr(rhs, scope, lineNo, stmt);
        if (lhsVars.length > 1) {
          const items = isPyTuple(rhsVal) ? rhsVal.items : Array.isArray(rhsVal) ? rhsVal : [];
          lhsVars.forEach((vName, idx) => {
            scope[vName.trim()] = items[idx];
          });
        } else {
          scope[lhs] = rhsVal;
        }
        i++;
        continue;
      }

      // Standalone expression (e.g. function call or method call)
      evalExpr(stmt, scope, lineNo, stmt);
      i++;
    }

    return { returned: false, value: null };
  }

  try {
    executeBlock(lines, env);
    const memory: MemoryBox[] = Object.entries(env).map(([name, val]) => ({
      name,
      value: formatPyValue(val, false),
      type: getPyType(val),
    }));
    return {
      output: outputLines.join('\n'),
      error: null,
      memory,
    };
  } catch (err: any) {
    const memory: MemoryBox[] = Object.entries(env).map(([name, val]) => ({
      name,
      value: formatPyValue(val, false),
      type: getPyType(val),
    }));
    return {
      output: outputLines.join('\n'),
      error: err?.message || String(err),
      memory,
    };
  }
}

export interface TaskValidationRule {
  expectedOutputLines?: string[];
  requiredSubstringsInCode?: string[];
  requiredVariable?: { name: string; type?: MemoryBox['type']; value?: string };
}

export function validatePythonTask(
  code: string,
  rule: TaskValidationRule
): { passed: boolean; feedback: string; result: ExecutionResult } {
  const result = runPythonCode(code);

  if (!code.trim()) {
    return {
      passed: false,
      feedback: 'Type your Python code in the editor first, then press Check!',
      result,
    };
  }

  if (result.error) {
    return {
      passed: false,
      feedback: `Your code hit a Python error: ${result.error.split('\n').pop()}`,
      result,
    };
  }

  if (rule.requiredSubstringsInCode) {
    for (const sub of rule.requiredSubstringsInCode) {
      if (!code.includes(sub)) {
        return {
          passed: false,
          feedback: `Make sure your code uses \`${sub}\` as requested in the instructions.`,
          result,
        };
      }
    }
  }

  if (rule.requiredVariable) {
    const found = result.memory.find((m) => m.name === rule.requiredVariable!.name);
    if (!found) {
      return {
        passed: false,
        feedback: `Make sure you create the variable \`${rule.requiredVariable.name}\`.`,
        result,
      };
    }
    if (rule.requiredVariable.type && found.type !== rule.requiredVariable.type) {
      return {
        passed: false,
        feedback: `\`${rule.requiredVariable.name}\` is a \`${found.type}\`, but it should be a \`${rule.requiredVariable.type}\` (use parentheses!).`,
        result,
      };
    }
    if (rule.requiredVariable.value && found.value !== rule.requiredVariable.value) {
      return {
        passed: false,
        feedback: `\`${rule.requiredVariable.name}\` currently holds \`${found.value}\`, expected \`${rule.requiredVariable.value}\`.`,
        result,
      };
    }
  }

  if (rule.expectedOutputLines) {
    const actualLines = result.output
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    for (const expectedLine of rule.expectedOutputLines) {
      if (!actualLines.some((actual) => actual === expectedLine.trim())) {
        return {
          passed: false,
          feedback: `Expected your program to print \`${expectedLine}\`, but got:\n${result.output || '(nothing printed)'}`,
          result,
        };
      }
    }
  }

  return {
    passed: true,
    feedback: 'Spot on! All checks passed and your memory boxes match.',
    result,
  };
}
