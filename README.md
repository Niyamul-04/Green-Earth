# JavaScript ES6 Concepts README

This README contains answers to key JavaScript ES6 questions.

---

## 1) Difference between `var`, `let`, and `const`

- **`var`**  
  - Function-scoped.  
  - Can be redeclared and updated.  
  - Hoisted (initialized with `undefined`).  

- **`let`**  
  - Block-scoped.  
  - Can be updated but **cannot be redeclared** in the same scope.  
  - Not initialized until declaration (temporal dead zone).  

- **`const`**  
  - Block-scoped.  
  - **Cannot be updated or redeclared**.  
  - Must be initialized at the time of declaration.  
  - For objects/arrays, the reference cannot change, but object properties or array elements can be modified.

---

## 2) Difference between `map()`, `forEach()`, and `filter()`

| Method        | Purpose | Return Value | Mutates Original Array? |
|---------------|---------|--------------|------------------------|
| `map()`       | Transforms each element based on a function | New array | No |
| `forEach()`   | Iterates over elements to perform side effects | `undefined` | No |
| `filter()`    | Selects elements based on a condition | New array | No |

**Example:**
```javascript
const numbers = [1, 2, 3, 4];

// map
const squared = numbers.map(n => n * n); // [1, 4, 9, 16]

// forEach
numbers.forEach(n => console.log(n)); // prints 1,2,3,4

// filter
const even = numbers.filter(n => n % 2 === 0); // [2, 4]
3) Arrow Functions in ES6
Shorter syntax for writing functions.

Do not have their own this, arguments, or super.

Syntax:

javascript
Copy code
// Traditional function
function add(a, b) {
    return a + b;
}

// Arrow function
const add = (a, b) => a + b;

// Single parameter
const square = x => x * x;
4) Destructuring Assignment in ES6
Unpacks values from arrays or properties from objects into distinct variables.

Array Destructuring:

javascript
Copy code
const arr = [1, 2, 3];
const [a, b, c] = arr;
console.log(a, b, c); // 1 2 3
Object Destructuring:

javascript
Copy code
const person = { name: "Alice", age: 25 };
const { name, age } = person;
console.log(name, age); // Alice 25

// Default value
const { city = "Unknown" } = person;
console.log(city); // Unknown
5) Template Literals in ES6
Use backticks ` instead of quotes.

Support interpolation ${expression} and multiline strings.

Example:

javascript
Copy code
const name = "Alice";
const age = 25;

// Interpolation
const greeting = `Hello, my name is ${name} and I am ${age} years old.`;
console.log(greeting);

// Multiline
const text = `This is line 1
This is line 2`;
console.log(text);