export function currentNpmScriptName() {
  return process.env.npm_lifecycle_event;
}

export function logDivider() {
  const line = "=".repeat(process.stdout.columns);
  console.log(line);
}

export function logLoadingAnimation() {
  // If width is equal to process.stdout.columns, the bar will overflow into the next line.
  // 4 is the length of the prefix "[*] ".
  // 55 is about the same length as the longest message in this script.
  const width = Math.min(process.stdout.columns - 4, 55);
  let frame = 0;
  let stop = false;

  const frames = ["▓"];
  let position = 0;
  const intervalId = setInterval(() => {
    if (stop) {
      clearInterval(intervalId);
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      return;
    }

    const currentFrame = frames[frame % frames.length];
    const loadingBar = `[*] ${currentFrame.repeat(
      position,
    )}▒${currentFrame.repeat(width - position - 1)}`;

    process.stdout.cursorTo(0);
    process.stdout.write(loadingBar);

    position = (position + 1) % width;

    frame++;
  }, 400);

  return {
    stopAndClear: () => {
      stop = true;
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
    },
  };
}

export function logReceiptAndEvents(
  rawreceiptList,
  blockid,
  matchedEventOffsets,
  filteredEventList,
) {
  console.log(
    "[*]",
    rawreceiptList.length,
    rawreceiptList.length > 1
      ? "receipts fetched from block"
      : "receipt fetched from block",
    blockid,
  );
  console.log(
    "[*]",
    matchedEventOffsets.length / 7,
    matchedEventOffsets.length / 7 > 1 ? "events matched" : "event matched",
  );
  for (let i in filteredEventList) {
    for (let j in filteredEventList[i]) {
      filteredEventList[i][j].prettyPrint(
        "\tTx[" + i + "]Event[" + j + "]",
        false,
      );
    }
  }
}
