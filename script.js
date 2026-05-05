const editor = document.getElementById("codeEditor");
const language = document.getElementById("language");
const runBtn = document.getElementById("runBtn");
const saveBtn = document.getElementById("saveBtn");
const output = document.getElementById("output");

// 🔥 여기 나중에 Render 주소 넣기
const SERVER_URL = "https://stone-code-l1dh.onrender.com";
// 예: const SERVER_URL = "https://your-server.onrender.com";

// ✔️ 언어별 기본 코드
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

// ✔️ 파일 저장용 확장자
const extensions = {
  python: "py",
  javascript: "js",
  java: "java",
  cpp: "cpp",
  c: "c",
  csharp: "cs",
  php: "php",
  ruby: "rb",
  go: "go",
  rust: "rs",
  kotlin: "kt",
  swift: "swift"
};

// ✔️ 언어 바꾸면 코드 자동 변경
language.addEventListener("change", () => {
  editor.value = examples[language.value] || "";
  localStorage.setItem("language", language.value);
  localStorage.setItem("code", editor.value);
});

// ✔️ 코드 저장
editor.addEventListener("input", () => {
  localStorage.setItem("code", editor.value);
});

// ✔️ 실행 버튼
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

  } catch (err) {
    output.textContent =
      "❌ 서버 연결 안됨\n\n" +
      "👉 로컬 테스트: node server.js 실행\n" +
      "👉 웹사이트: Render 주소 연결 필요";
  }
});

// ✔️ 파일 저장
saveBtn.addEventListener("click", () => {
  const ext = extensions[language.value] || "txt";
  const blob = new Blob([editor.value], { type: "text/plain" });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `code.${ext}`;
  a.click();

  URL.revokeObjectURL(a.href);
});

// ✔️ 페이지 로드 시 복원
window.addEventListener("load", () => {
  language.value = localStorage.getItem("language") || "python";
  editor.value = localStorage.getItem("code") || examples[language.value];
});
