import { TaskValidationRule } from '../utils/pythonEngine';

export interface WarmupGame {
  id: string;
  tag: string;
  question: string;
  options: string[];
  correctOption: string;
  explanation: string;
  teacherTip: string;
}

export interface TypeAlongLine {
  code: string;
  note: string;
}

export interface PuzzleItem {
  id: string;
  type: 'predict' | 'bug' | 'gap';
  label: string;
  badgeText: string;
  prompt: string;
  code: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface PracticeTask {
  id: string;
  tier: 'Warm-up' | 'Core' | 'Stretch 🔥';
  number: string;
  prompt: string;
  starterCode: string;
  modelAnswer: string;
  validation: TaskValidationRule;
}

export interface LessonPart {
  id: string;
  partLabel: string;
  title: string;
  boltLog: string;
  concepts: string[];
  typeAlongTitle: string;
  typeAlongLines: TypeAlongLine[];
  exampleCode: string;
  exampleTryPrompt: string;
  puzzleTitle: string;
  puzzles: PuzzleItem[];
  practiceTasks: PracticeTask[];
}

export interface ClassActivity {
  id: string;
  number: number;
  title: string;
  shortDescription: string;
  expectedOutputPreview: string;
  steps: string[];
  boilerplateCode: string;
  solutionCode: string;
  hint: string;
  validation: TaskValidationRule;
}

export interface QuizQuestion {
  id: number;
  question: string;
  code?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const CLASS_CONTEXT = {
  courseTitle: 'Python data structures: lists, tuples, dictionaries',
  sessionNumber: 'Session 2 of 12',
  duration: '60 minutes',
  studentName: 'Sneha',
  classDateTime: '10:30 PM IST, Mon, Nov 16, 2026',
  grade: 'Grade 11',
  referencePdfPath:
    '/assets/aistudio/screencapture-codingal-teacher-dashboard-classes-69566319-2026-11-16-21_48_09_23e38ce0.pdf',
};

export const LESSON_FLOW_LOOPS = [
  { step: 1, label: 'Warm-up', duration: '3 min', target: '#warmup' },
  { step: 2, label: 'Warm-up games', duration: '5 min', target: '#warmup-games' },
  { step: 3, label: 'What is a tuple? Make & size them', duration: '9 min', target: '#part-1' },
  { step: 4, label: 'Indexing, slicing & immutability', duration: '9 min', target: '#part-2' },
  { step: 5, label: 'Joining (+) & nested tuples', duration: '9 min', target: '#part-3' },
  { step: 6, label: 'Activity 1: Tuple Operations', duration: '7 min', target: '#activity-1' },
  { step: 7, label: 'Activity 2: Flip Flop', duration: '7 min', target: '#activity-2' },
  { step: 8, label: 'Activity 3: Weather Prediction', duration: '5 min', target: '#activity-3' },
  { step: 9, label: 'Final Quiz', duration: '5 min', target: '#quiz' },
  { step: 10, label: 'Set the after-class project', duration: '1 min', target: '#project' },
];

export const LEARNING_OUTCOMES = [
  'Understand the concept of tuples as ordered, immutable collections of heterogeneous data',
  'Create tuples using parentheses () and the tuple() constructor (including single-item (9,) tuples)',
  'Practice positive/negative indexing, slicing, and counting elements with len() and .count()',
  'Explore tuple immutability (TypeError), concatenation (+), and nested tuples for complex data storage',
];

export const PREREQUISITES = [
  'Python lists, variables, and data types (int, float, str, bool)',
  'Loops (for i in range(...) and while) and if/else conditions',
  'Writing a function with def and return',
];

export const HAVE_READY = [
  'This interactive page (all Python code runs live in the browser)',
  'Paper or the built-in Drawing Board to sketch index boxes (0..5 and -6..-1)',
];

export const WARMUP_GAMES: WarmupGame[] = [
  {
    id: 'wg-1',
    tag: "🎮 Game 1 of 5 · 🦄 Which one doesn't belong?",
    question: 'Look at these four Python collections. Which one is NOT a tuple?',
    options: [
      "(10, 20, 25.75)",
      "('Jessa', 'Emma', 'Kelly')",
      "['P', 'Y', 'T', 'H', 'O', 'N']",
      "tuple([1, 2, 3])",
    ],
    correctOption: "['P', 'Y', 'T', 'H', 'O', 'N']",
    explanation:
      "Square brackets [] create a mutable LIST! Rounded parentheses () or tuple() create an unchangeable TUPLE.",
    teacherTip: 'Ask Sneha what happens if we try to change an item inside () versus [].',
  },
  {
    id: 'wg-2',
    tag: '🎮 Game 2 of 5 · 🔒 Lock or Change?',
    question:
      'Which piece of data should be stored in an unchangeable TUPLE instead of a list?',
    options: [
      'A live shopping cart where items are added',
      'RGB color code for Pure Gold: (255, 210, 63)',
      'Today’s to-do tasks that get crossed off',
      'Current player chat messages',
    ],
    correctOption: 'RGB color code for Pure Gold: (255, 210, 63)',
    explanation:
      'Fixed records like RGB colors, GPS coordinates (lat, lng), or database keys belong in tuples so no code accidentally alters them!',
    teacherTip: 'Connect this to heterogeneous data: a student record ("Sneha", 11, True).',
  },
  {
    id: 'wg-3',
    tag: '🎮 Game 3 of 5 · 🕵️ Spot the Sneaky Comma',
    question:
      'In Activity 1 we add a single number 9 to a tuple. Which one is a real 1-item tuple in Python?',
    options: ['(9)', '(9,)', '[9]', '{9}'],
    correctOption: '(9,)',
    explanation:
      'Without the trailing comma, Python treats (9) as just the integer 9 inside math parentheses! (9,) is a 1-element tuple.',
    teacherTip: 'Have Sneha test print(type((9))) vs print(type((9,))) in the live editor.',
  },
  {
    id: 'wg-4',
    tag: '🎮 Game 4 of 5 · 🎯 Zero-Index Sprint',
    question:
      "In tuple1 = ('P', 'Y', 'T', 'H', 'O', 'N'), what do tuple1[3] and tuple1[-1] give?",
    options: ["'T' and 'N'", "'H' and 'N'", "'H' and 'O'", "'Y' and 'P'"],
    correctOption: "'H' and 'N'",
    explanation:
      "Counting from 0: index 0 is 'P', 1 is 'Y', 2 is 'T', 3 is 'H'! And index -1 always grabs the very last item, 'N'.",
    teacherTip: 'Point out that the 4th element is at index 3 because indexing starts at 0.',
  },
  {
    id: 'wg-5',
    tag: '🎮 Game 5 of 5 · 🪞 Flip-Flop Mirror Check',
    question:
      'In Activity 2, a "Flip-Flop" tuple is a palindrome (reads the same forward and backward). Which tuple is Flip-Flop?',
    options: [
      '(1, 2, 3, 3, 2, 1)',
      '(1, 2, 3, 1, 2, 3)',
      '(10, 20, 30, 20)',
      "('P', 'Y', 'T', 'H', 'O', 'N')",
    ],
    correctOption: '(1, 2, 3, 3, 2, 1)',
    explanation:
      'Comparing from both ends (s=0, e=5 -> 1==1; s=1, e=4 -> 2==2; s=2, e=3 -> 3==3), every pair matches!',
    teacherTip: 'Preview how two pointers (start s and end e) walk toward the middle.',
  },
];

export const LESSON_PARTS: LessonPart[] = [
  {
    id: 'part-1',
    partLabel: 'Part 1 of 3 · learn, see, practise',
    title: 'What is a tuple? Make them & size them',
    boltLog:
      "Vault log, day 1. Yesterday's lists were great for playlists that change, but what if we store locked records that must NEVER be overwritten? Enter Python's unchangeable vault: the tuple!",
    concepts: [
      '💡 Tuples are ordered collections of heterogeneous data that are unchangeable (immutable). "Heterogeneous" means a single tuple can store variables of all types together: integers, floats, strings, and booleans.',
      'We can create a tuple in two ways: (1) Using rounded parentheses () with comma-separated items, like number_tuple = (10, 20, 25.75), or (2) Using the tuple() constructor, like tuple([10, 20, 30]).',
      "Size of a Tuple: Use the len() function to find the number of items in a tuple. For example, len(('P', 'Y', 'T', 'H', 'O', 'N')) returns 6. And to create a 1-item tuple, always include a trailing comma: (9,).",
    ],
    typeAlongTitle: 'Create your first heterogeneous tuples',
    typeAlongLines: [
      {
        code: 'number_tuple = (10, 20, 25.75)',
        note: 'Rounded brackets () with ints and a float. Ask: is this homogeneous or heterogeneous?',
      },
      {
        code: 'print(number_tuple)',
        note: 'Prints (10, 20, 25.75) with rounded parentheses.',
      },
      {
        code: "string_tuple = ('Jessa', 'Emma', 'Kelly')",
        note: 'A tuple of three strings in order.',
      },
      {
        code: 'print(string_tuple)',
        note: "Prints ('Jessa', 'Emma', 'Kelly').",
      },
      {
        code: "tuple1 = ('P', 'Y', 'T', 'H', 'O', 'N')",
        note: 'Six characters stored as a tuple.',
      },
      {
        code: 'print(len(tuple1))',
        note: 'len(tuple1) counts the items and prints 6.',
      },
    ],
    exampleCode: `# create a tuple using ()
# number tuple
number_tuple = (10, 20, 25.75)
print(number_tuple)

# string tuple
string_tuple = ('Jessa', 'Emma', 'Kelly')
print(string_tuple)

# Size of a Tuple using len()
tuple1 = ('P', 'Y', 'T', 'H', 'O', 'N')
print(len(tuple1))

# heterogeneous tuple with mixed data types
tuplex = ("tuple", False, 3.2, 1)
print(tuplex)`,
    exampleTryPrompt:
      'Try adding single = (9,) and print(len(single)). What happens if you remove the comma inside (9,)?',
    puzzleTitle: 'Puzzle break: parentheses & len()',
    puzzles: [
      {
        id: 'p1-1',
        type: 'predict',
        label: 'Puzzle 1: What will it print?',
        badgeText: '🔮 What will it print?',
        prompt: 'Puzzle 1: say what happens before you run it',
        code: `tuple1 = ('P', 'Y', 'T', 'H', 'O', 'N')\nprint(len(tuple1))`,
        options: ['5', '6', '7', "('P', 'Y', 'T', 'H', 'O', 'N')"],
        correctAnswer: '6',
        explanation: "len() counts how many elements are inside tuple1. There are 6 letters in 'PYTHON'.",
      },
      {
        id: 'p1-2',
        type: 'predict',
        label: 'Puzzle 2: What will it print?',
        badgeText: '🔮 What will it print?',
        prompt: 'Puzzle 2: heterogeneous tuple check',
        code: `tuplex = ("tuple", False, 3.2, 1)\nprint(len(tuplex))`,
        options: ['4', '3', 'True', 'An error (mixed types)'],
        correctAnswer: '4',
        explanation:
          'Tuples are heterogeneous—they happily hold a string, boolean, float, and integer together! Total items: 4.',
      },
      {
        id: 'p1-3',
        type: 'gap',
        label: 'Puzzle 3: Fill the gap',
        badgeText: '🧩 Fill the gap',
        prompt: 'Puzzle 3: make a 1-item tuple containing 9',
        code: `single_tuple = ___\nprint(len(single_tuple)) # prints 1`,
        options: ['(9,)', '(9)', '[9]', '9'],
        correctAnswer: '(9,)',
        explanation: 'A single-element tuple in Python requires a trailing comma: (9,).',
      },
    ],
    practiceTasks: [
      {
        id: 't1-1',
        tier: 'Warm-up',
        number: '1.1',
        prompt:
          'Create a heterogeneous tuple called tuplex with ("tuple", False, 3.2, 1) and print it, then print its length on the next line.',
        starterCode: `# Create tuplex and print it and its length\n`,
        modelAnswer: `tuplex = ("tuple", False, 3.2, 1)\nprint(tuplex)\nprint(len(tuplex))`,
        validation: {
          requiredVariable: { name: 'tuplex', type: 'tuple' },
          expectedOutputLines: ["('tuple', False, 3.2, 1)", '4'],
        },
      },
      {
        id: 't1-2',
        tier: 'Core',
        number: '1.2',
        prompt:
          "Create string_tuple = ('Jessa', 'Emma', 'Kelly') and number_tuple = (10, 20, 25.75). Print both tuples on separate lines.",
        starterCode: `string_tuple = ('Jessa', 'Emma', 'Kelly')\n`,
        modelAnswer: `string_tuple = ('Jessa', 'Emma', 'Kelly')\nnumber_tuple = (10, 20, 25.75)\nprint(string_tuple)\nprint(number_tuple)`,
        validation: {
          requiredVariable: { name: 'number_tuple', type: 'tuple' },
          expectedOutputLines: ["('Jessa', 'Emma', 'Kelly')", '(10, 20, 25.75)'],
        },
      },
      {
        id: 't1-3',
        tier: 'Stretch 🔥',
        number: '1.3',
        prompt:
          'Use the tuple() constructor to convert the list [100, 200, 300, 400] into a tuple named locked_scores, then print locked_scores and its len().',
        starterCode: `raw_list = [100, 200, 300, 400]\n`,
        modelAnswer: `raw_list = [100, 200, 300, 400]\nlocked_scores = tuple(raw_list)\nprint(locked_scores)\nprint(len(locked_scores))`,
        validation: {
          requiredVariable: { name: 'locked_scores', type: 'tuple' },
          expectedOutputLines: ['(100, 200, 300, 400)', '4'],
        },
      },
    ],
  },
  {
    id: 'part-2',
    partLabel: 'Part 2 of 3 · learn, see, practise',
    title: 'Indexing, slicing & tuple immutability',
    boltLog:
      'Vault log, day 2. Even though a tuple is locked against edits, you can read any item instantly using its index [] or slice out a sub-tuple [start:stop]. Try to overwrite an item, though, and Python sounds the TypeError alarm!',
    concepts: [
      "💡 Indexing: A tuple is an ordered sequence of items, holding the order of insertion. We access an item using its index number inside square brackets [], starting from 0 on the left up to len(tuple)-1. To access the 4th element of tuple1 = ('P', 'Y', 'T', 'H', 'O', 'N'), we use tuple1[3] ('H'). Negative index -1 accesses the last element ('N').",
      "Slicing: Slicing a tuple accesses a range of elements using tuple[start:stop], where start is inclusive and stop is exclusive. For example, tuple1[3:7] returns ('H', 'O', 'N'), and tuple[:6] slices from index 0 up to index 5.",
      "Changing a Tuple (Immutability): Unlike lists, tuples are immutable! Elements of a tuple cannot be changed once assigned. Writing tuple1[2] = 'G' raises TypeError: 'tuple' object does not support item assignment.",
    ],
    typeAlongTitle: 'Index, slice, and test the immutability lock',
    typeAlongLines: [
      {
        code: "tuple1 = ('P', 'Y', 'T', 'H', 'O', 'N')",
        note: 'Our 6-letter tuple: indexes 0, 1, 2, 3, 4, 5.',
      },
      {
        code: 'print(tuple1[0])',
        note: "Access the first element at index 0 -> 'P'.",
      },
      {
        code: 'print(tuple1[3])',
        note: "Access the fourth element at index 3 -> 'H'.",
      },
      {
        code: 'print(tuple1[-1])',
        note: "Access the last element at index -1 -> 'N'.",
      },
      {
        code: 'print(tuple1[3:7])',
        note: "Slicing from index 3 to 7 -> ('H', 'O', 'N').",
      },
      {
        code: 'for i in range(4):',
        note: 'Loop i through 0, 1, 2, 3.',
      },
      {
        code: '    print(tuple1[i])',
        note: 'Prints P, Y, T, H on four lines.',
      },
    ],
    exampleCode: `tuple1 = ('P', 'Y', 'T', 'H', 'O', 'N')

# access the first element
print(tuple1[0])

# access the fourth element
print(tuple1[3])

# access the last element
print(tuple1[-1])

# slicing from position 3 to 7
print(tuple1[3:7])

# loop through the first 4 items
for i in range(4):
    print(tuple1[i])`,
    exampleTryPrompt:
      "Uncomment or add tuple1[2] = 'G' at the bottom and press Run to see Python's exact TypeError!",
    puzzleTitle: 'Puzzle break: indexes, slices & TypeError',
    puzzles: [
      {
        id: 'p2-1',
        type: 'predict',
        label: 'Puzzle 1: What will it print?',
        badgeText: '🔮 What will it print?',
        prompt: 'Puzzle 1: positive and negative indexing',
        code: `tuple1 = ('P', 'Y', 'T', 'H', 'O', 'N')\nprint(tuple1[0], tuple1[3], tuple1[-1])`,
        options: ['P H N', 'P T N', 'Y H O', 'P H O'],
        correctAnswer: 'P H N',
        explanation:
          'Index 0 is the 1st letter (P), index 3 is the 4th letter (H), and index -1 is the last letter (N).',
      },
      {
        id: 'p2-2',
        type: 'predict',
        label: 'Puzzle 2: What will it print?',
        badgeText: '🔮 What will it print?',
        prompt: 'Puzzle 2: slicing with [start:stop]',
        code: `tuplex = (2, 4, 3, 5, 4, 6, 7, 8, 6, 1)\nprint(tuplex[3:5])`,
        options: ['(5, 4)', '(3, 5, 4)', '(4, 3, 5)', '(5, 4, 6)'],
        correctAnswer: '(5, 4)',
        explanation:
          'Start index 3 is 5, index 4 is 4, and stop index 5 is excluded! So tuplex[3:5] gives (5, 4).',
      },
      {
        id: 'p2-3',
        type: 'bug',
        label: 'Puzzle 3: What happens here?',
        badgeText: '🐞 Spot the Immutability Error',
        prompt: 'Puzzle 3: trying to change an element in a tuple',
        code: `tuple1 = ('P', 'Y', 'T', 'H', 'O', 'N')\ntuple1[2] = 'G'\nprint(tuple1)`,
        options: [
          "TypeError: 'tuple' object does not support item assignment",
          "('P', 'Y', 'G', 'H', 'O', 'N')",
          "('P', 'G', 'T', 'H', 'O', 'N')",
          'IndexError: tuple index out of range',
        ],
        correctAnswer: "TypeError: 'tuple' object does not support item assignment",
        explanation:
          'Tuples are immutable! Once created, you cannot assign a new value to an index like tuple1[2].',
      },
    ],
    practiceTasks: [
      {
        id: 't2-1',
        tier: 'Warm-up',
        number: '2.1',
        prompt:
          "Given tuple1 = ('P', 'Y', 'T', 'H', 'O', 'N'), print the first element, the fourth element, and the last element on three lines.",
        starterCode: `tuple1 = ('P', 'Y', 'T', 'H', 'O', 'N')\n`,
        modelAnswer: `tuple1 = ('P', 'Y', 'T', 'H', 'O', 'N')\nprint(tuple1[0])\nprint(tuple1[3])\nprint(tuple1[-1])`,
        validation: {
          expectedOutputLines: ['P', 'H', 'N'],
        },
      },
      {
        id: 't2-2',
        tier: 'Core',
        number: '2.2',
        prompt:
          'Given tuplex = (2, 4, 3, 5, 4, 6, 7, 8, 6, 1), slice elements from index 3 to 5 into _slice and print it, then slice the first 6 elements using [:6] and print it.',
        starterCode: `tuplex = (2, 4, 3, 5, 4, 6, 7, 8, 6, 1)\n`,
        modelAnswer: `tuplex = (2, 4, 3, 5, 4, 6, 7, 8, 6, 1)\n_slice = tuplex[3:5]\nprint(_slice)\n_slice = tuplex[:6]\nprint(_slice)`,
        validation: {
          expectedOutputLines: ['(5, 4)', '(2, 4, 3, 5, 4, 6)'],
        },
      },
      {
        id: 't2-3',
        tier: 'Stretch 🔥',
        number: '2.3',
        prompt:
          "Use a for loop with range(4) to print the first 4 letters of tuple1 = ('P', 'Y', 'T', 'H', 'O', 'N'), one per line.",
        starterCode: `tuple1 = ('P', 'Y', 'T', 'H', 'O', 'N')\n`,
        modelAnswer: `tuple1 = ('P', 'Y', 'T', 'H', 'O', 'N')\nfor i in range(4):\n    print(tuple1[i])`,
        validation: {
          requiredSubstringsInCode: ['for', 'range(4)'],
          expectedOutputLines: ['P', 'Y', 'T', 'H'],
        },
      },
    ],
  },
  {
    id: 'part-3',
    partLabel: 'Part 3 of 3 · learn, see, practise',
    title: 'Concatenation (+), .count() & nested tuples',
    boltLog:
      "Vault log, day 3. Since we can't edit a tuple in place, how do we add an item? We merge two tuples with + to build a brand-new tuple! And just like boxes inside a vault, a tuple can nest other tuples and even mutable lists inside it.",
    concepts: [
      "💡 Concatenation of two tuples: Merging two tuples uses the + operator to produce a new tuple. For example, ('P', 'Y', 'T', 'H', 'O', 'N') + (1, 2, 3) creates ('P', 'Y', 'T', 'H', 'O', 'N', 1, 2, 3). To add a single element 9 to tuplex, write tuplex = tuplex + (9,).",
      'Counting occurrences: tuple1.count(50) counts how many times the value 50 appears inside tuple1.',
      "Nested Tuple: A tuple can contain another data type (tuple or list) which in turn contains another collection. In nest_tup = (1, 2, ('a', 'b'), [4, 5, 'nesting']), nest_tup[2] is ('a', 'b') and nest_tup[-1][-1] is 'nesting'. Bonus rule: if an element inside a tuple is a mutable list, its nested items CAN be changed!",
    ],
    typeAlongTitle: 'Join tuples with + and unlock nested tuples',
    typeAlongLines: [
      {
        code: "tuple1 = ('P', 'Y', 'T', 'H', 'O', 'N')",
        note: 'First tuple of 6 letters.',
      },
      {
        code: 'tuple2 = (1, 2, 3)',
        note: 'Second tuple of 3 integers.',
      },
      {
        code: 'print(tuple1 + tuple2)',
        note: '+ merges them into a new 9-item tuple!',
      },
      {
        code: "nest_tup = (1, 2, ('a', 'b'), [4, 5, 'nesting'])",
        note: 'A nested tuple holding ints, a tuple, and a list.',
      },
      {
        code: 'print(nest_tup[2])',
        note: "Index 2 is the inner tuple ('a', 'b').",
      },
      {
        code: 'print(nest_tup[-1][-1])',
        note: "Last item is the list; its last item is 'nesting'!",
      },
    ],
    exampleCode: `# Concatenation of two tuples using +
tuple1 = ('P', 'Y', 'T', 'H', 'O', 'N')
tuple2 = (1, 2, 3)
print(tuple1 + tuple2)

# Nested tuple containing a tuple and a list
nest_tup = (1, 2, ('a', 'b'), [4, 5, 'nesting'])
print(nest_tup)

# access elements of nested tuple
print(nest_tup[2])
print(nest_tup[-1][-1])

# Count occurrences of 50
scores = (50, 10, 60, 70, 50)
print("Count of 50:", scores.count(50))`,
    exampleTryPrompt:
      "What happens if you modify the list inside nest_tup using nest_tup[3][2] = 'unlocked' and print(nest_tup)? Try it!",
    puzzleTitle: 'Puzzle break: joining & nested tuples',
    puzzles: [
      {
        id: 'p3-1',
        type: 'predict',
        label: 'Puzzle 1: What will it print?',
        badgeText: '🔮 What will it print?',
        prompt: 'Puzzle 1: adding a single item with + (9,)',
        code: `tuplex = (4, 6, 2, 8, 3, 1)\ntuplex = tuplex + (9,)\nprint(tuplex)`,
        options: [
          '(4, 6, 2, 8, 3, 1, 9)',
          '(4, 6, 2, 8, 3, 10)',
          'TypeError',
          '(9, 4, 6, 2, 8, 3, 1)',
        ],
        correctAnswer: '(4, 6, 2, 8, 3, 1, 9)',
        explanation:
          'Using + with a 1-element tuple (9,) creates a brand-new tuple with 9 added at the end.',
      },
      {
        id: 'p3-2',
        type: 'predict',
        label: 'Puzzle 2: What will it print?',
        badgeText: '🔮 What will it print?',
        prompt: 'Puzzle 2: double indexing into a nested tuple',
        code: `nest_tup = (1, 2, ('a', 'b'), [4, 5, 'nesting'])\nprint(nest_tup[-1][-1])`,
        options: ["'nesting'", "('a', 'b')", '5', "'b'"],
        correctAnswer: "'nesting'",
        explanation:
          "nest_tup[-1] grabs the last item [4, 5, 'nesting'], and [-1] on that list grabs 'nesting'.",
      },
      {
        id: 'p3-3',
        type: 'predict',
        label: 'Puzzle 3: What will it print?',
        badgeText: '🔮 What will it print?',
        prompt: 'Puzzle 3: counting occurrences with .count()',
        code: `tuple1 = (50, 10, 60, 70, 50)\nprint(tuple1.count(50))`,
        options: ['2', '1', '0', '50'],
        correctAnswer: '2',
        explanation: '50 appears at index 0 and index 4, so tuple1.count(50) returns 2.',
      },
    ],
    practiceTasks: [
      {
        id: 't3-1',
        tier: 'Warm-up',
        number: '3.1',
        prompt:
          'Create tuple1 = (50, 10, 60, 70, 50) and print how many times 50 appears using .count(50).',
        starterCode: `tuple1 = (50, 10, 60, 70, 50)\n`,
        modelAnswer: `tuple1 = (50, 10, 60, 70, 50)\nprint(tuple1.count(50))`,
        validation: {
          requiredSubstringsInCode: ['count(50)'],
          expectedOutputLines: ['2'],
        },
      },
      {
        id: 't3-2',
        tier: 'Core',
        number: '3.2',
        prompt:
          'Start with tuplex = (4, 6, 2, 8, 3, 1). Merge (9,) onto the end using + and store it back in tuplex, then print tuplex.',
        starterCode: `tuplex = (4, 6, 2, 8, 3, 1)\n`,
        modelAnswer: `tuplex = (4, 6, 2, 8, 3, 1)\ntuplex = tuplex + (9,)\nprint(tuplex)`,
        validation: {
          requiredSubstringsInCode: ['+'],
          expectedOutputLines: ['(4, 6, 2, 8, 3, 1, 9)'],
        },
      },
      {
        id: 't3-3',
        tier: 'Stretch 🔥',
        number: '3.3',
        prompt:
          "Given nest_tup = (1, 2, ('a', 'b'), [4, 5, 'nesting']), print the nested tuple ('a', 'b') on the first line and 'nesting' on the second line.",
        starterCode: `nest_tup = (1, 2, ('a', 'b'), [4, 5, 'nesting'])\n`,
        modelAnswer: `nest_tup = (1, 2, ('a', 'b'), [4, 5, 'nesting'])\nprint(nest_tup[2])\nprint(nest_tup[-1][-1])`,
        validation: {
          expectedOutputLines: ["('a', 'b')", 'nesting'],
        },
      },
    ],
  },
];

export const COMMON_MISTAKES = [
  {
    title: 'Forgetting the comma in a 1-item tuple',
    body: 'Writing (9) is just the number 9 in math brackets! Always write (9,) with a trailing comma when making or concatenating a single-element tuple.',
    wrong: 'tuplex = tuplex + (9)   # TypeError!',
    right: 'tuplex = tuplex + (9,)  # Works!',
  },
  {
    title: 'Trying to assign tuple1[2] = "G"',
    body: 'Tuples are immutable. You cannot overwrite, append, or remove items in place. Instead, build a new tuple with + or convert to a list first.',
    wrong: "tuple1[2] = 'G'         # TypeError!",
    right: 'tuple1 = tuple1[:2] + ("G",) + tuple1[3:]',
  },
  {
    title: 'Expecting the stop index in a slice',
    body: 'In tuplex[3:5], Python stops BEFORE index 5—so you get only index 3 and index 4 (two items total).',
    wrong: 'tuplex[3:5]  # NOT 3 items!',
    right: 'tuplex[3:5]  # Gives items at index 3 and 4',
  },
  {
    title: 'Confusing immutable tuple with a nested mutable list',
    body: 'A tuple cannot have its slots reassigned, but if one slot holds a list [4, 5, "nesting"], the items inside that list CAN be modified!',
    wrong: 'nest_tup[3] = [1, 2]       # TypeError on tuple slot',
    right: 'nest_tup[3][2] = "changed" # Allowed on inner list!',
  },
];

export const CLASS_ACTIVITIES: ClassActivity[] = [
  {
    id: 'activity-1',
    number: 1,
    title: 'Tuple Operations',
    shortDescription:
      'Write a program to perform the following operations: 1. Create a tuple with different datatypes 2. Create another tuple of integers 3. Create a new tuple by adding 9 to the previous tuple 4. Count the occurrences of an element in the tuple 5. Perform slicing on the tuple.',
    expectedOutputPreview: `('tuple', False, 3.2, 1)\n(4, 6, 2, 8, 3, 1)\n(4, 6, 2, 8, 3, 1, 9)\n2\n(5, 4)\n(2, 4, 3, 5, 4, 6)`,
    steps: [
      '1) Create a tuple `tuplex` containing different data types ("tuple", False, 3.2, 1) and print it.',
      '2) Create another tuple `tuplex` containing only integer values (4, 6, 2, 8, 3, 1) and print it.',
      '3) Demonstrate tuple immutability: use `+` to merge `(9,)` onto `tuplex` and print the updated tuple.',
      '4) Create `tuple1 = (50, 10, 60, 70, 50)` and use `tuple1.count(50)` to print how many times 50 appears.',
      '5) Create `tuplex = (2, 4, 3, 5, 4, 6, 7, 8, 6, 1)`, slice `tuplex[3:5]` and `tuplex[:6]`, and print each slice.',
    ],
    boilerplateCode: `# 1) Create a tuple \`tuplex\` containing different data types (string, boolean, float, integer)
#    and print the tuple.
tuplex = ("tuple", False, 3.2, 1)
print(tuplex)

# 2) Create another tuple \`tuplex\` containing only integer values and print it.
tuplex = (4, 6, 2, 8, 3, 1)
print(tuplex)

# 3) Demonstrate tuple immutability:
#    a) Tuples cannot be modified directly (cannot add/change elements in the same tuple).
#    b) Use the \`+\` operator to merge tuples and create a new tuple.
#    c) Add a single element (9) using \`(9,)\` and store the new tuple back in \`tuplex\`.
#    d) Print the updated tuple.


# 4) Create a tuple \`tuple1\` and count occurrences of a specific value:
#    a) Use \`tuple1.count(50)\` to count how many times 50 appears.
#    b) Print the count.


# 5) Create a tuple \`tuplex\` with multiple integers to demonstrate slicing.
tuplex = (2, 4, 3, 5, 4, 6, 7, 8, 6, 1)

# 6) Slice a portion of the tuple using indexing:
#    a) Use \`tuplex[3:5]\` to get elements from index 3 up to index 4 (stop index is excluded).
#    b) Store it in \`_slice\` and print it.


# 7) Slice from the beginning when the start index is not provided:
#    a) Use \`tuplex[:6]\` to get elements from index 0 up to index 5.
#    b) Store it in \`_slice\` and print it.
`,
    solutionCode: `#Create a tuple with different data types
tuplex = ("tuple", False, 3.2, 1)
print(tuplex)

#create a tuple
tuplex = (4, 6, 2, 8, 3, 1)
print(tuplex)
#tuples are immutable, so you can not add new elements
#using merge of tuples with the + operator you can add an element and it will create a new tuple
tuplex = tuplex + (9,)
print(tuplex)

#Counts the number of occurrences of item 50 from a tuple
tuple1 = (50, 10, 60, 70, 50)
print(tuple1.count(50))

#create a tuple
tuplex = (2, 4, 3, 5, 4, 6, 7, 8, 6, 1)
#used tuple[start:stop] the start index is inclusive and the stop index
_slice = tuplex[3:5]
#is exclusive
print(_slice)
#if the start index isn't defined, is taken from the beg inning of the tuple
_slice = tuplex[:6]
print(_slice)`,
    hint: 'Remember: to add 9 to tuplex, write `tuplex = tuplex + (9,)` with a comma inside `(9,)`. Then use `tuple1 = (50, 10, 60, 70, 50)` and `print(tuple1.count(50))`.',
    validation: {
      expectedOutputLines: [
        "('tuple', False, 3.2, 1)",
        '(4, 6, 2, 8, 3, 1)',
        '(4, 6, 2, 8, 3, 1, 9)',
        '2',
        '(5, 4)',
        '(2, 4, 3, 5, 4, 6)',
      ],
    },
  },
  {
    id: 'activity-2',
    number: 2,
    title: 'Flip Flop',
    shortDescription:
      "Write a program to check whether the given tuple - (1, 2, 3, 3, 2, 1) is a palindrome or not. If it's a palindrome, then it is the same after being reversed.",
    expectedOutputPreview: `The Tuple is Flip-Flop`,
    steps: [
      '1) Define a function `palind(r)` to check whether a tuple is a palindrome (reads the same forward and backward).',
      '2) Inside the function: set `e = len(r) - 1` (last index) and `s = 0` (first index).',
      '3) Use a `while(s < e):` loop to compare `r[s]` and `r[e]`. If `r[s] != r[e]`, return `False`. Otherwise move inward: `s += 1` and `e -= 1`.',
      '4) If the loop finishes without mismatches, `return True`.',
      '5) Create `r = (1, 2, 3, 3, 2, 1)` and call `if(palind(r)):` to print `"The Tuple is Flip-Flop"` or `"The Tuple is not Flip-Flop"`.',
    ],
    boilerplateCode: `# 1) Define a function \`palind(r)\` to check whether a tuple is a palindrome
#    (meaning it reads the same forward and backward).
def palind(r):
    # 2) Inside the function:
    #    a) Set \`e = len(r) - 1\` to point to the last index of the tuple.
    #    b) Set \`s = 0\` to point to the first index of the tuple.
    e = len(r) - 1
    s = 0

    # 3) Use a \`while\` loop to compare elements from both ends:
    #    a) Repeat while \`s < e\`.
    #    b) If the element at the start \`r[s]\` is not equal to the element at the end \`r[e]\`,
    #       return False immediately (not a palindrome).
    #    c) Move the start pointer forward using \`s += 1\`.
    #    d) Move the end pointer backward using \`e -= 1\`.
    while(s < e):
        if(r[s] != r[e]):
            return False
        s += 1
        e -= 1

    # 4) If the loop finishes without mismatches, return True.
    return True

# 5) Create a tuple \`r = (1, 2, 3, 3, 2, 1)\`.
r = (1, 2, 3, 3, 2, 1)

# 6) Call the function \`palind(r)\`:
#    a) If it returns True, print "The Tuple is Flip-Flop".
#    b) Otherwise, print "The Tuple is not Flip-Flop".
`,
    solutionCode: `# function to check whether palindrome or not
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
    print("The Tuple is not Flip-Flop")`,
    hint: 'At the bottom of the code, write:\nif(palind(r)):\n    print("The Tuple is Flip-Flop")\nelse:\n    print("The Tuple is not Flip-Flop")',
    validation: {
      requiredSubstringsInCode: ['def palind', 'while'],
      expectedOutputLines: ['The Tuple is Flip-Flop'],
    },
  },
  {
    id: 'activity-3',
    number: 3,
    title: 'Weather Prediction',
    shortDescription:
      'Create a tuple named weather with these elements - (1, 0, 0, 0, 1, 1, 0). If the element is 0 then the value of rainy increases by 1 otherwise the value of sunny increases by 1. On the basis of the value of rainy and sunny, predict the weather.',
    expectedOutputPreview: `Bad weather`,
    steps: [
      '1) Create a tuple `weather = (1, 0, 0, 0, 1, 1, 0)` containing 7 values (one for each day of the week).',
      '2) Initialize two counters: `sunny = 0` and `rainy = 0`.',
      '3) Use a `for i in range(0, 7):` loop to iterate through the 7 days: if `weather[i] == 0`, increase `rainy` by 1; otherwise increase `sunny` by 1.',
      '4) After counting, compare `if(sunny > rainy): print("Good weather")` else `print("Bad weather")`.',
    ],
    boilerplateCode: `# 1) Create a tuple \`weather\` containing 7 values (one for each day of the week).
weather = (1, 0, 0, 0, 1, 1, 0)

# 2) Initialize two counters:
#    a) \`sunny = 0\` to count sunny days
#    b) \`rainy = 0\` to count rainy days
sunny = 0
rainy = 0

# 3) Use a \`for\` loop to iterate through the 7 days (index 0 to 6):
#    a) Check the value at \`weather[i]\`
#    b) If it is 0, increase \`rainy\` by 1
#    c) Otherwise, increase \`sunny\` by 1


# 4) After counting, compare the number of sunny days and rainy days:
#    a) If \`sunny > rainy\`, print "Good weather"
#    b) Else, print "Bad weather"
`,
    solutionCode: `weather=(1,0,0,0,1,1,0)
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
    print("Bad weather")`,
    hint: 'Loop with `for i in range(0, 7):` and check `if(weather[i] == 0): rainy += 1` else `sunny += 1`. Since there are four 0s and three 1s, rainy (4) > sunny (3), so it prints "Bad weather"!',
    validation: {
      requiredSubstringsInCode: ['weather', 'for'],
      expectedOutputLines: ['Bad weather'],
    },
  },
];

export const HOMEWORK_TASKS: PracticeTask[] = [
  {
    id: 'hw-1',
    tier: 'Warm-up',
    number: 'Homework 1',
    prompt:
      '1. Create a tuple of 4 planet names called planets, then print how many items it has and its last item on two lines.',
    starterCode: `planets = ("Mercury", "Venus", "Earth", "Mars")\n`,
    modelAnswer: `planets = ("Mercury", "Venus", "Earth", "Mars")\nprint(len(planets))\nprint(planets[-1])`,
    validation: {
      requiredVariable: { name: 'planets', type: 'tuple' },
      expectedOutputLines: ['4', 'Mars'],
    },
  },
  {
    id: 'hw-2',
    tier: 'Core',
    number: 'Homework 2',
    prompt:
      '2. Given marks = (85, 92, 78, 92, 88, 92), print how many times 92 appears, then print the middle two marks using a slice [2:4].',
    starterCode: `marks = (85, 92, 78, 92, 88, 92)\n`,
    modelAnswer: `marks = (85, 92, 78, 92, 88, 92)\nprint(marks.count(92))\nprint(marks[2:4])`,
    validation: {
      expectedOutputLines: ['3', '(78, 92)'],
    },
  },
  {
    id: 'hw-3',
    tier: 'Stretch 🔥',
    number: 'Homework 3',
    prompt:
      '3. Test whether word_tup = ("r", "a", "d", "a", "r") is a palindrome using slicing[::-1] and print True or False.',
    starterCode: `word_tup = ("r", "a", "d", "a", "r")\n`,
    modelAnswer: `word_tup = ("r", "a", "d", "a", "r")\nprint(word_tup == word_tup[::-1])`,
    validation: {
      expectedOutputLines: ['True'],
    },
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is the output of this code?',
    code: `tuple1 = ('P', 'Y', 'T', 'H', 'O', 'N')\nprint(len(tuple1))`,
    options: ['5', '6', '7', 'IndexError'],
    correctIndex: 1,
    explanation: "There are 6 characters in ('P', 'Y', 'T', 'H', 'O', 'N'), so len(tuple1) returns 6.",
  },
  {
    id: 2,
    question: 'Which statement accurately describes a Python tuple?',
    options: [
      'Unordered and mutable collection of items',
      'Ordered and immutable collection of heterogeneous data',
      'Ordered collection that only stores integers',
      'A collection created using square brackets []',
    ],
    correctIndex: 1,
    explanation:
      'Tuples preserve insertion order, cannot be changed once created (immutable), and can store mixed data types (heterogeneous).',
  },
  {
    id: 3,
    question: 'What does this indexing code print?',
    code: `tuple1 = ('P', 'Y', 'T', 'H', 'O', 'N')\nprint(tuple1[3], tuple1[-1])`,
    options: ['T N', 'H N', 'H O', 'Y P'],
    correctIndex: 1,
    explanation: 'Index 0 is P, 1 is Y, 2 is T, 3 is H! And index -1 is the last item, N.',
  },
  {
    id: 4,
    question: 'What happens when you run this code?',
    code: `tuple1 = ('P', 'Y', 'T', 'H', 'O', 'N')\ntuple1[2] = 'G'\nprint(tuple1)`,
    options: [
      "Prints ('P', 'Y', 'G', 'H', 'O', 'N')",
      "Prints ('P', 'G', 'T', 'H', 'O', 'N')",
      "Raises TypeError: 'tuple' object does not support item assignment",
      'Raises ValueError',
    ],
    correctIndex: 2,
    explanation: 'Tuples are immutable, so item assignment via tuple1[2] = "G" raises a TypeError.',
  },
  {
    id: 5,
    question: 'How do you correctly add the single integer 9 to the end of `tuplex = (4, 6, 2)`?',
    code: `tuplex = (4, 6, 2)`,
    options: [
      'tuplex.append(9)',
      'tuplex = tuplex + (9)',
      'tuplex = tuplex + (9,)',
      'tuplex[3] = 9',
    ],
    correctIndex: 2,
    explanation:
      'Because tuples are immutable, we concatenate a 1-element tuple `(9,)` (with the trailing comma!) using `+`.',
  },
  {
    id: 6,
    question: 'What does this slice produce?',
    code: `tuplex = (2, 4, 3, 5, 4, 6, 7, 8, 6, 1)\nprint(tuplex[3:5])`,
    options: ['(3, 5, 4)', '(5, 4)', '(4, 3, 5)', '(5, 4, 6)'],
    correctIndex: 1,
    explanation:
      'Start index 3 gives 5, index 4 gives 4, and stop index 5 is excluded, resulting in (5, 4).',
  },
  {
    id: 7,
    question: 'What does this nested tuple lookup print?',
    code: `nest_tup = (1, 2, ('a', 'b'), [4, 5, 'nesting'])\nprint(nest_tup[-1][-1])`,
    options: ["('a', 'b')", "'b'", '5', 'nesting'],
    correctIndex: 3,
    explanation:
      "nest_tup[-1] selects the list [4, 5, 'nesting'], and [-1] selects its last item 'nesting'.",
  },
  {
    id: 8,
    question: 'In Activity 2 (Flip Flop), what condition inside `while(s < e):` detects that a tuple is NOT a palindrome?',
    code: `if (???):\n    return False`,
    options: ['r[s] == r[e]', 'r[s] != r[e]', 's == e', 'len(r) == 0'],
    correctIndex: 1,
    explanation:
      'When the item at the start pointer `r[s]` does not equal the item at the end pointer `r[e]`, it cannot be a palindrome.',
  },
];

export const TEACHER_AGENDA_STEPS = [
  {
    step: '1] Greetings & Icebreaker (0–3 min)',
    teacherAction: 'Welcome Sneha warmly! Ask the 2,000-song / spawn-coordinate warm-up question before showing any code.',
    studentAction: 'Share ideas on when data should be locked vs changeable.',
  },
  {
    step: '2] Discuss Previous Class ACP + Bolt Games (3–8 min)',
    teacherAction: 'Review Sneha’s previous class ACP (Lists) and play 3–4 quick games with Bolt the robot.',
    studentAction: 'Vote on each game option and explain why.',
  },
  {
    step: '3] Teach Class Material in 3 Loops (8–35 min)',
    teacherAction: 'Run Part 1 (Creating & len), Part 2 (Indexing, Slicing & TypeError), and Part 3 (Concatenation & Nested Tuples) using the Live Type-Along and Puzzle Breaks.',
    studentAction: 'Type along, test slices in the visualizer, and solve the puzzle breaks.',
  },
  {
    step: '4] Do the 3 Class Activities (35–52 min)',
    teacherAction: 'Guide Sneha through Activity 1 (Tuple Operations), Activity 2 (Flip Flop), and Activity 3 (Weather Prediction). Encourage pressing Check often!',
    studentAction: 'Complete the boilerplate steps and verify all 3 activities.',
  },
  {
    step: '5] 60-Second Eye Exercise Break (52–53 min)',
    teacherAction: 'Launch the built-in 20-20-20 Eye Exercise widget so both teacher and student rest their eyes from the screen.',
    studentAction: 'Follow the 60-second guided eye relaxation loop.',
  },
  {
    step: '6] Summarize Goal + Final Quiz (53–58 min)',
    teacherAction: 'Recap the 4 Learning Outcomes and run the 8-question Final Quiz aloud.',
    studentAction: 'Answer the quiz questions and explain the tricky ones.',
  },
  {
    step: '7] Today’s ACP & Next Class Preview (58–60 min)',
    teacherAction: 'Assign the Tuple Vault ACP starter code and preview next session: Dictionaries & Key-Value Lookups!',
    studentAction: 'Copy the ACP starter code and ask any final doubts.',
  },
];

export const TEACHER_THUMB_RULES = [
  'Thumb Rule: Go through the teacher agenda before starting the class.',
  'Always appreciate and motivate the student (Sneha) during the session.',
  'Keep the session jolly: try to add as many interactive ways as possible to keep the student engaged.',
  'Never make the session a mugging parrot—explain the concepts with visual memory boxes and guide the student to do the activity.',
  'End the class with the reflection questions: Did you enjoy today’s lesson? Are you excited about the next lesson? Do you have any doubts?',
];
