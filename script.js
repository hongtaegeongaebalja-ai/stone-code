const editor = document.getElementById("codeEditor");
const language = document.getElementById("language");
const runBtn = document.getElementById("runBtn");
const saveBtn = document.getElementById("saveBtn");
const output = document.getElementById("output");

// 🔥 Render 서버 주소
const SERVER_URL = "https://stone-code-l1dh.onrender.com";

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

// ✔️ 확장자
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

// ✔️ 언어 변경
language.addEventListener("change", () => {
  editor.value = examples[language.value] || "";
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

    // 🔥 응답 상태 체크 추가 (중요)
    if (!response.ok) {
      throw new Error("서버 응답 실패");
    }

    const data = await response.json();

    output.textContent =
      data.output ||
      data.error ||
      "No output";

  } catch (err) {
    output.textContent =
      "❌ 서버 연결 실패\n\n" +
      "1️⃣ Render 서버 켜져있는지 확인\n" +
      "2️⃣ server.js에 /run 있는지 확인\n" +
      "3️⃣ CORS 설정 확인\n\n" +
      "에러: " + err.message;
  }
});

// ✔️ 저장
saveBtn.addEventListener("click", () => {
  const ext = extensions[language.value] || "txt";
  const blob = new Blob([editor.value], { type: "text/plain" });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `code.${ext}`;
  a.click();

  URL.revokeObjectURL(a.href);
});

// ✔️ 초기 로드
window.addEventListener("load", () => {
  language.value = "python";
  editor.value = examples.python;
});
