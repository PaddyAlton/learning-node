function say(words) {
  console.log(words);
}

function myExecutor(someFunction, arg1) {
  someFunction(arg1);
}

const myExecutor2 = (someFunction, arg1) => {
  someFunction(arg1);
}

myExecutor(say, "Hello World!")
myExecutor2(say, "How are you?")

myExecutor(
  (word) => {console.log(word)},
  "What a nice day!"
)
