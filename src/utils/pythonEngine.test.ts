import test from 'node:test';
import assert from 'node:assert/strict';
import { runPythonCode, validatePythonTask } from './pythonEngine';

test('PDF Page 1: Creating number_tuple, string_tuple, and len(tuple1)', () => {
  const code = `
# create a tuple using ()
# number tuple
number_tuple = (10, 20, 25.75)
print(number_tuple)

# string tuple
string_tuple = ('Jessa', 'Emma', 'Kelly')
print(string_tuple)

tuple1 = ('P', 'Y', 'T', 'H', 'O', 'N')
print(len(tuple1))
`;
  const res = runPythonCode(code);
  assert.equal(res.error, null);
  assert.equal(
    res.output,
    "(10, 20, 25.75)\n('Jessa', 'Emma', 'Kelly')\n6"
  );
  assert.equal(res.memory.find((m) => m.name === 'number_tuple')?.type, 'tuple');
  assert.equal(res.memory.find((m) => m.name === 'tuple1')?.value, "('P', 'Y', 'T', 'H', 'O', 'N')");
});

test('PDF Page 2: Indexing, slicing, and TypeError on tuple mutation', () => {
  const indexCode = `
tuple1 = ('P', 'Y', 'T', 'H', 'O', 'N')
print(tuple1[0])
print(tuple1[3])
print(tuple1[-1])
print(tuple1[3:7])
`;
  const res1 = runPythonCode(indexCode);
  assert.equal(res1.error, null);
  assert.equal(res1.output, "P\nH\nN\n('H', 'O', 'N')");

  const mutateCode = `
tuple1 = ('P', 'Y', 'T', 'H', 'O', 'N')
tuple1[2] = 'G'
print(tuple1[2])
`;
  const res2 = runPythonCode(mutateCode);
  assert.ok(res2.error?.includes("TypeError: 'tuple' object does not support item assignment"));
});

test('PDF Page 3: Concatenation and Nested Tuples', () => {
  const code = `
tuple1 = ('P', 'Y', 'T', 'H', 'O', 'N')
tuple2 = (1, 2, 3)
print(tuple1 + tuple2)

nest_tup = (1, 2, ('a', 'b'), [4, 5, 'nesting'])
print(nest_tup)
print(nest_tup[2])
print(nest_tup[-1][-1])
`;
  const res = runPythonCode(code);
  assert.equal(res.error, null);
  assert.equal(
    res.output,
    "('P', 'Y', 'T', 'H', 'O', 'N', 1, 2, 3)\n(1, 2, ('a', 'b'), [4, 5, 'nesting'])\n('a', 'b')\nnesting"
  );
});

test('PDF Activity 1: Tuple Operations exact solution passes auto-grader', () => {
  const solution1 = `
tuplex = ("tuple", False, 3.2, 1)
print(tuplex)

tuplex = (4, 6, 2, 8, 3, 1)
print(tuplex)

tuplex = tuplex + (9,)
print(tuplex)

tuple1 = (50, 10, 60, 70, 50)
print(tuple1.count(50))

tuplex = (2, 4, 3, 5, 4, 6, 7, 8, 6, 1)
_slice = tuplex[3:5]
print(_slice)
_slice = tuplex[:6]
print(_slice)
`;
  const validation = validatePythonTask(solution1, {
    expectedOutputLines: [
      "('tuple', False, 3.2, 1)",
      "(4, 6, 2, 8, 3, 1)",
      "(4, 6, 2, 8, 3, 1, 9)",
      "2",
      "(5, 4)",
      "(2, 4, 3, 5, 4, 6)",
    ],
  });
  assert.equal(validation.passed, true);
});

test('PDF Activity 2: Flip Flop palindrome tuple checker exact solution passes', () => {
  const solution2 = `
def palind(r):
    e = len(r) - 1
    s = 0
    while(s<e):
        if(r[s]!=r[e]):
            return False
        s+=1
        e-=1
    return True

r = (1,2,3,3,2,1)

if(palind(r)):
    print("The Tuple is Flip-Flop")
else:
    print("The Tuple is not Flip-Flop")
`;
  const validation = validatePythonTask(solution2, {
    expectedOutputLines: ['The Tuple is Flip-Flop'],
    requiredSubstringsInCode: ['def palind', 'while'],
  });
  assert.equal(validation.passed, true);
});

test('PDF Activity 3: Weather Prediction exact solution passes', () => {
  const solution3 = `
weather=(1,0,0,0,1,1,0)
sunny=0
rainy=0
for i in range(0,7):
    if(weather[i]==0):
        rainy+=1
    else:
        sunny+=1

if(sunny>rainy):
    print("Good weather")
else:
    print("Bad weather")
`;
  const validation = validatePythonTask(solution3, {
    expectedOutputLines: ['Bad weather'],
    requiredSubstringsInCode: ['weather', 'for'],
  });
  assert.equal(validation.passed, true);
});
