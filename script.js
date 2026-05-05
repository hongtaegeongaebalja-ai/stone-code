const editor = document.getElementById("codeEditor");
const language = document.getElementById("language");
const runBtn = document.getElementById("runBtn");
const saveBtn = document.getElementById("saveBtn");
const output = document.getElementById("output");

// Render 서버 주소 넣는 곳
const SERVER_URL = "http://localhost:3000";
// 나중에 Render 주소 만들면 이렇게 바꾸기:
// const SERVER_URL = "https://너의-render주소.onrender.com";

const examples = {
  python: 'print("hello world")',
  javascript: 'console.log("hello world");',
  java: `public class Main {
  public static void main(String[] args) {
    System.out.println("hello world");
  }
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
  cout << "hello world" << endl;
  return 0;
}`,
  c: `#include <stdio.h>

int main() {
  printf("hello world\\n");
  return 0;
}`,
  csharp: `using System;

class Program {
  static void Main() {
    Console.WriteLine("hello world");
  }
}`,
  php: `<?php
echo "hello world";
?>`,
  ruby: `puts "hello world"`,
  go: `package main

import "fmt"

func main() {
  fmt.Println("hello world")
}`,
  rust: `fn main() {
  println!("hello world");
}`,
  kotlin: `fun main() {
  println("hello world")
}`,
  swift: `print("hello world")`
};

const extensions = {
  python: "main.py",
  javascript: "script.js",
  java: "Main.java",
  cpp: "main.cpp",
  c: "main.c",
  csharp: "Program.cs",
  php: "index.php",
  ruby: "main.rb",
  go: "main.go",
  rust: "main.rs",
  kotlin: "Main.kt",
  swift: "main.swift"
};

language.addEventListener("change", () => {
  editor.value = examples[language.value] || "";
  localStorage.setItem("language", language.value);
  localStorage.setItem("code", editor.value);
});

editor.addEventListener("input", () => {
  localStorage.setItem("code", editor.value);
});

runBtn.addEventListener("click", async () => {
  output.textContent = "Running...";

  try {
    const response = await fetch(`${SERVER_URL}/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        language: language.value,
        code: editor.value
      })
    });

    const data = await response.json();

    output.textContent =
      data.output ||
      data.error ||
      "No output";
  } catch (error) {
    output.textContent =
      "Server is not connected.\n\nIf testing on your computer, run:\nnode server.js\n\nIf using Netlify, connect your Render server URL.";
  }
});

saveBtn.addEventListener("click", () => {
  const fileName = extensions[language.value] || "code.txt";
  const blob = new Blob([editor.value], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();

  URL.revokeObjectURL(url);
});

window.addEventListener("load", () => {
  language.value = localStorage.getItem("language") || "python";
  editor.value = localStorage.getItem("code") || examples[language.value];
});
