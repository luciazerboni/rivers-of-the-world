let table;
let ralewayFont;

function preload() {
  // Carica il file CSV
  table = loadTable(
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQc_QIEPuycl16yVzQmFiR2Me3LGNJkBpJiZhMLzjuonjgi2brYEjkjPanBQ6RL1m2zhrSC7DuZcQ4T/pub?output=csv',
    'csv',
    'header'
  );

  // Carica font
  //ralewayFont = loadFont('https://fonts.gstatic.com/s/raleway/v28/1Ptsg8zYS_SKggPN4iEgvnHyvveLxVvaoQI.woff2');
}

function setup() {
  createCanvas(windowWidth, 5150);
  background('white');
  noLoop();

  // Imposta font
  //textFont(ralewayFont);

  let xStart = 50; // Punto iniziale delle linee sull'asse x
  let y = 160; // Punto iniziale sull'asse y (spazio per titolo e sottotitolo)
  let lineHeight = 50; // Spaziatura tra linee
  let maxLength = 700; // Lunghezza max linee

  // Colori temperatura
  let coldColor = color(0, 150, 255); // azzurro
  let hotColor = color(255, 50, 50); // rosso

  // titolo
  fill(0);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(24);
  text("Rivers in the World", width / 2, 50); // Titolo principale
  textSize(16);
  textStyle(NORMAL);
  text("Graphical representation of the world's major rivers", width / 2, 80); // Sottotitolo

  // Trova valori massimi e minimi per lunghezza, portata e temperatura
  let maxRiverLength = 0;
  let maxDischarge = 0;
  let maxTemp = -Infinity;
  let minTemp = Infinity;

  for (let r = 0; r < table.getRowCount(); r++) {
    let length = table.getNum(r, 'length');
    let discharge = table.getNum(r, 'discharge');
    let avgTemp = table.getNum(r, 'avg_temp');
    
    if (length > maxRiverLength) {
      maxRiverLength = length;
    }
    if (discharge > maxDischarge) {
      maxDischarge = discharge;
    }
    if (avgTemp > maxTemp) {
      maxTemp = avgTemp;
    }
    if (avgTemp < minTemp) {
      minTemp = avgTemp;
    }
  }

  // disegna linee per ogni fiume
  for (let r = 0; r < table.getRowCount(); r++) {
    let riverName = table.getString(r, 'name'); // Nome del fiume
    let riverLength = table.getNum(r, 'length'); // Lunghezza del fiume
    let riverDischarge = table.getNum(r, 'discharge'); // Portata del fiume
    let riverTemp = table.getNum(r, 'avg_temp'); // Temperatura media del fiume
    let riverCountry = table.getString(r, 'countries');

    // Scala la lunghezza del fiume rispetto alla lunghezza massima
    let scaledLength = map(riverLength, 0, maxRiverLength, 0, maxLength);

    // Scala la portata del fiume per definire lo spessore
    let strokeWeightValue = map(riverDischarge, 0, maxDischarge, 1, 10);

    // colore in base alla temperatura
    let lineColor = lerpColor(coldColor, hotColor, map(riverTemp, minTemp, maxTemp, 0, 1));

    // disegna linea
    stroke(lineColor);
    strokeWeight(strokeWeightValue);
    line(xStart, y, xStart + scaledLength, y);

    // nome fiume
    noStroke();
    textStyle(BOLD);
    fill(0);
    textAlign(LEFT, CENTER);
    textSize(15)
    text(riverName, xStart + scaledLength + 10, y);

    // temperatura media e paese
    textStyle(NORMAL);
    textSize(13);
    text(riverCountry, xStart + scaledLength + 10, y + 15);
    text(`${riverTemp}°C`, xStart + scaledLength + 10, y + 30);

    // Sposta il punto y per la prossima linea
    y += lineHeight;
  }
}