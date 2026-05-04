const editor = document.getElementById("codeEditor");
const language = document.getElementById("language");
const runBtn = document.getElementById("runBtn");
const saveBtn = document.getElementById("saveBtn");
const output = document.getElementById("output");

const errorHints = [
  {
    check: /SyntaxError|Unexpected token|Unexpected end/i,
    msg: "문법 오류입니다. 괄호, 따옴표, 세미콜론, 중괄호가 빠졌는지 확인하세요."
  },
  {
    check: /ReferenceError|is not defined/i,
    msg: "없는 변수나 함수를 사용했습니다. 이름이 정확한지 확인하세요."
  },
  {
    check: /TypeError/i,
    msg: "자료형 오류입니다. 숫자/문자/배열/객체를 잘못 사용했을 수 있습니다."
  },
  {
    check: /Cannot read properties|null|undefined/i,
    msg: "비어 있는 값(null/undefined)을 사용했습니다. 값이 존재하는지 확인하세요."
  },
  {
    check: /IndentationError/i,
    msg: "파이썬 들여쓰기 오류입니다. 공백 간격을 맞춰보세요."
  },
  {
    check: /NameError/i,
    msg: "파이썬에서 없는 변수나 함수를 사용했습니다."
  }
];

function explainError(errorText) {
  const found = errorHints.find(item => item.check.test(errorText));
  return found ? found.msg : "정확한 원인은 알 수 없지만 코드 문법이나 변수 이름을 확인해보세요.";
}

runBtn.addEventListener("click", () => {
  const code = editor.value;
  const lang = language.value;

  output.textContent = "Running...";

  try {
    if (lang === "javascript") {
      let logs = [];
      const oldLog = console.log;

      console.log = (...args) => {
        logs.push(args.join(" "));
      };

      try {
        const result = new Function(code)();
        console.log = oldLog;

        output.textContent =
          logs.length > 0
            ? logs.join("\n")
            : result !== undefined
            ? String(result)
            : "실행 완료. 출력값은 없습니다.";
      } catch (err) {
        console.log = oldLog;

        output.textContent =
          "❌ 오류 발생\n\n" +
          err.name + ": " + err.message +
          "\n\n왜 오류났나요?\n" +
          explainError(err.name + " " + err.message);
      }
    } else {
      output.textContent =
        "⚠️ 현재 브라우저에서는 JavaScript만 직접 실행할 수 있습니다.\n\n" +
        lang +
        " 코드는 서버 실행 기능을 연결해야 실제 실행됩니다.";
    }
  } catch (err) {
    output.textContent =
      "❌ 알 수 없는 오류\n\n" +
      err.message +
      "\n\n왜 오류났나요?\n" +
      explainError(err.message);
  }
});

saveBtn.addEventListener("click", () => {
  const code = editor.value;
  const lang = language.value;

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

  const blob = new Blob([code], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `code.${extensions[lang] || "txt"}`;
  a.click();
  URL.revokeObjectURL(a.href);
});
