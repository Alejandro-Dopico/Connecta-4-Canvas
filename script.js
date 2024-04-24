/*** RESUMEN ***  !!!La explicación de las funciones estan al principio de ellas metodos y todo!!!!

    Conecta 4, en primer lugar he querido hacerlo con objetos
    esto se debe a que creo que seria más escalable a futuro.
    En este proyecto genero todas las posiciones y a cada posicion
    se le puede asignar una fitcha que posteriormente esta fitcha se puede
    assignar a un jugador.La idea de generar todas las posiciones es
    poder guardar estas en una matriz con columnas y filas para iterar con ellas.
    En estas posiciones guardamos sus valores de X y Y, para luego representar sus posiciones
    en el tablero y poder crear animaciones.Lo malo es que las posiciones son estaticas, es decir,
    si moviese el tablero hacia la derecha las cordenadas de las fichas siempre son las mismas,
    quedarian desplazadas en el tablero.
*/

/* Las clases Ficha, Posicion y Jugador. */
class Ficha {
  constructor(idFicha, idJugador) {
    this.idFicha = idFicha;
    this.idJugador = idJugador;
  }
}

class Posicion {
  constructor(col, row, valueX, valueY, fitcha) {
    this.col = col;
    this.row = row;
    this.valueX = valueX;
    this.valueY = valueY;
    this.fitcha = fitcha;
  }
}

class Jugador {
  constructor(idJugador, ball, nombre, isCPU = false) {
    this.idJugador = idJugador;
    this.ball = ball;
    this.nombre = nombre;
    this.isCPU = isCPU;
  }
}

/*  *** generarPosiciones ***
    Esta función se ocupa de generar las posiciones, recibe los valores de filas y columnas
    para crear la matriz, reciben la posicion valueX e valueY inicial, luego se ocupara de
    que si cambia de fila sumara o restara con los valores spacingX e Y para definir la posicion
    correcta de cada fitcha. 
*/
function generarPosiciones(numColumnas, numFilas, startX, startY, spacingX, spacingY) {
  let columnas = [];
  let currentX = startX;
  let currentY = startY;

  /* Esta es la creación de la matriz, que luego quedaran objetos con los valores. */
  for (let col = 1; col <= numColumnas; col++) {
    currentY = startY;

    for (let row = 1; row <= numFilas; row++) {
      let nuevaColumna = new Posicion(col, row, currentX, currentY, null);
      // Aquí hacemos el push del objeto al array para tener todos los objetos en un array. 
      columnas.push(nuevaColumna);
      currentY -= spacingY;
    }

    currentX += spacingX;
    currentY = startY;
  }

  return columnas;
}

/*  Almacenamos ese Array en la variable posiciones y le pasamos los valores,
si quisieramos mas columnas filas o que las posiciones de los circulos cambiasen
seria aquí. */
let posiciones = generarPosiciones(7, 6, 33, 455, 72, 83);

/* Aquí creamos los dos circulos uno para cada jugador, color azul y rojo. */
var ballPlayer1 = {
  x: optionX,
  y: optionY,
  radius: 33,
  color: "blue"
};

var ballPlayer2 = {
  x: optionX,
  y: optionY,
  radius: 33,
  color: "red"
};

// Instanciamos los dos jugadores y le asignamos una pelota. Y guardamos los jugadores en un array.
let player1 = new Jugador(1, ballPlayer1, "Jugador 1");
let player2 = new Jugador(2, ballPlayer2, "Jugador 2");

const players =
  [player1, player2];

/*  *** AddEventListener ***
    Aquí hacemos que javascript nada más ejecutar el contenido esconda los canvas
    y segun el id que recoga de las opciones que escogamos en los botones enseñara una u otros
    divs que hay en el html. Y estos ejecutan diferentes funciones, una es iniciarPartida() y
    otra con la CPU; iniciarPartidaConCPU().
*/
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("canvasContainer").style.display = "none";
  document.querySelectorAll(".colVertical1, .colVertical2, .colVertical3, .colVertical4, .colVertical5, .colVertical6, .colVertical7").forEach(function (btn) {
    btn.style.display = "none";
  });

  document.getElementById("PlayerVsPlayer").addEventListener("click", function () {
    document.getElementById("textoInicio").style.display = "none";
    document.getElementById("textoJuego").style.display = "flex";
    document.getElementById("inicio").style.display = "none";
    iniciarPartida();
  });

  document.getElementById("PlayerVsCPU").addEventListener("click", function () {
    document.getElementById("textoInicio").style.display = "none";
    document.getElementById("textoElegir").style.display = "flex";
    document.getElementById("elegirJugador").style.display = "block";
    document.getElementById("textoJuego").style.display = "none"; 
    document.getElementById("inicio").style.display = "none";
    iniciarPartidaConCPU();
  });
});

/*  *** iniciarPartida() ***
    Esta funcion es la que se encarga de habilitar el panel de juego, aquí ya se habra
    escogido todas las opciones previas antes de ejecturarse.
*/
function iniciarPartida() {
  document.getElementById("elegirJugador").style.display = "none";
  // Mostrar el tablero y los botones del tablero
  document.getElementById("canvasContainer").style.display = "block";
  document.querySelectorAll(".colVertical1, .colVertical2, .colVertical3, .colVertical4, .colVertical5, .colVertical6, .colVertical7").forEach(function (btn) {
    btn.style.display = "flex";
  });
}

/*  *** iniciarPartidaConCPU() ***
    Esta llama a la función anterior para iniciar partida, pero se le pasa el jugador que empieza
    por parametro que viene desde el boton del html y assigna siempre a que el jugador2 es la maquina
    Añadiendole al objeto que es CPU accionara otras funciones dentro del programa.
    Lo más importante es que si has seleccionado que empieza el jugador2 "la maquina",
    empezara directamente la CPU llamando a la funcion CpuMove().
*/
function iniciarPartidaConCPU(eleccion) {
  player2.isCPU = true;

  if (eleccion == 1) {
    iniciarPartida();
  } else if (eleccion == 2) {
    isAnimating = true;
    document.getElementById(`colVertical1`).disabled = true;
    iniciarPartida();
    CpuMove();
  }
}

let ficha = document.getElementById("ficha");
let tablero = document.getElementById("tablero");

let contextFicha = ficha.getContext("2d");
let contextTablero = tablero.getContext("2d");

var optionX = null;
var optionY = null;


// Inicializo a el jugador dos para que en la funcion alternatePlayer() empieze el "Jugador 1".
let currentPlayer = player2;

/*
  Aquí instanciamos la variable animaciṕon, que esta tendra el control de si la animación esta
  en curso o no, ya que iremos activando y desactivando el boton para que no se superpongan los jugadores.
*/
let isAnimating = false;

/*  *** alternatePlyer ***
    Esta funcion es la que llamamos con los botones que viene como parametro la columna.
    Primero comprobaremos en el array anteriormente si la columna esta disponible por las filas que tiene.
    Esto se assignara a la variable "isColumnFull", después si no hay más filas en la columna para posicionar,
    mandara el mensaje de error.

    En esta parte tambien tenemos "isAnimating" que es un booleano que activamos y desactivamos cuando la animacion
    de caer la bola esta en marcha, porque este activara y desactivara los botones invisibles que es para posicionar la fitcha
    esto se ha tenido que implementar porque si accionabamos los botones rapidamente se descuadraba todo.
    También en esta funcion cambiaremos el jugador alternando entre el 1 y el 2.
    Luego printaremos que turno de jugador pertoca y llamaremos a la funcion selected, que este le pasaremos
    el jugador actual (El objeto) y la columna, es numero que ya a comprobado que se pueda posicionar la fitcha.
*/
function alternatePlayer(colSelectedButton) {
  if (isAnimating) return;
  var resultado = document.getElementById("resultado");
  resultado.innerHTML = `Turno de <strong>${currentPlayer.nombre}</strong>`;
  var columnSelected = parseInt(colSelectedButton);
  document.getElementById(`colVertical${columnSelected}`).disabled = true;
  isAnimating = true;

  // Aquí es donde comprueba si la columna esta disponible, en el caso que no retorna y en el caso que si sigue la función.
  let isColumnFull = posiciones.some(posicion => posicion.col === columnSelected && posicion.fitcha === null);
  if (!isColumnFull) {
    var error = document.getElementById("error");
    error.innerHTML = "<span style='color: red; font-weight: bold;'>Columna llena, seleccione otra columna.</span>";
    document.getElementById(`colVertical${columnSelected}`).disabled = false;
    isAnimating = false;
    return;
  }

  if (currentPlayer === player1) {
    currentPlayer = player2;
  } else {
    currentPlayer = player1;
  }
  // llamamos a la funcion selected al haber recogido al jugador y a la columna.
  selected(currentPlayer, columnSelected);
}

/*  *** CpuMove() ***
    Como bien indica el nombre de esta función, se encarga de asignarle un movimiento a la CPU
    Assignamos que jugador es la CPU, jugador2 y llamamos a la función minimax para generar
    el mejor movimiento que tiene a su disposción. Y parseamos el resultado a int porque es el que lee selected.
*/
function CpuMove() {
  currentPlayer = player2;
  selected(currentPlayer, minimax(currentPlayer, posiciones, 7, currentPlayer, -Infinity, Infinity));
}


/*  *** selected ***
    Esta función se ocupa de buscar la fila disponible correspondiente a la columna y esta asignarla
    al jugador (Objeto), ya que como anteriormente he explicado cada fitcha tiene como parametro Player,
    que se le assignara el jugador. Una vez hecho esto procederemos a dibujar la bolla con la funcion
    "drawBall", que le pasaremos la posicion donde debera dibujarla y que jugador, ya que el jugador
    tiene en su atributo del objeto el circulo, y esto hara que printemos el color de la fitcha del jugador.
*/
function selected(player, columnSelected) {
  var error = document.getElementById("error");
  error.innerHTML = "";

  let selectedPosition = null;
  for (let i = 0; i < posiciones.length; i++) {
    if (posiciones[i].col === columnSelected && posiciones[i].fitcha === null) {
      selectedPosition = posiciones[i];
      break;
    }
  }

  selectedPosition.fitcha = player;
  drawBall(selectedPosition, player);


  /* Con la funcion checkWinner */
  if (checkWinner(player)) {
    document.getElementById("reiniciarBtn").style.display = "inline";
    // Si hay un ganador, imprimir el resultado en el HTML
    var ganador = document.getElementById("ganador");
    ganador.innerHTML = `<span style='color: green; font-weight: bold;'>¡${player.nombre} ha ganado!</span>`;
  }
}

/* 
  Creamos una variable local para almacenar todas las bolas seleccionadas
  y que estas se queden dibujadas en el tablero.
*/
let balls = [];

/*  *** drawBall ***
    Esta funcion incluye dos funciones el "drawAllBalls" y "animateClosure".
    Primero inicializamos las variables para la anciamción "initialY" es la variable
    con el valor de ValueY que empezara la animación, es decir, arriba del todo del tablero,
    Luego la otra "fallSpeed" es la velocidad con la que caera la fitcha, aunque en diferentes 
    navegadores cae a una velocidad diferente.
*/
function drawBall(position, player) {
  let initialY = 1;
  let fallSpeed = 10;

  /*  esta función se ocupa de dibujar todas las bolas en el tablero,
    además utiliza canvas, la variable "ContextFicha". esta calcula el tamaño del ciruclo
    con las variables de las bolas que tenimas declaradas arriba.
  */
  function drawAllBalls() {
    balls.forEach(ball => {
      contextFicha.beginPath();
      contextFicha.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
      contextFicha.fillStyle = ball.color;
      contextFicha.strokeStyle = ball.borderColor;
      contextFicha.lineWidth = 2;
      contextFicha.fill();
      contextFicha.stroke();
    });
  }

  /*  animateClosure es la funcion que anime la bola caer, porque cada fitcha tiene su posicion declarada,
    entonces le pasamos la posicion de la fitcha e creamos la animación, que basicamente mueve la bola desde el punto
    initialY hasta el valor que tiene la propia fitcha.
  */
  function animateClosure(position) {
    return function animate() {

      initialY += fallSpeed;
      contextFicha.clearRect(0, 0, ficha.width, ficha.height);

      /* dibujamos todas las bolas que existen, para que se mantengan sobre el tablero. */
      drawAllBalls();

      // Aquí empezamos la animación.
      contextFicha.beginPath();
      contextFicha.arc(position.valueX, initialY, player.ball.radius, 0, 2 * Math.PI);
      contextFicha.fillStyle = player.ball.color;
      contextFicha.fill();

      // Si la bola todavía no ha alcanzado la posición final (valueY), continuar la animación
      if (initialY < position.valueY) {
        requestAnimationFrame(animate);
      } else {
        /*  Añadir la nueva bola al array de bolas para tener 
            constancia de que ya estan posiciobadas, esto con los objetos. */
        balls.push({ x: position.valueX, y: position.valueY, radius: player.ball.radius, color: player.ball.color });

        // Almacenar la ficha en la posición seleccionada y se registra en el jugador.
        position.fitcha = player;

        if (!checkWinner(player)) {
          document.querySelectorAll(".colVertical1, .colVertical2, .colVertical3, .colVertical4, .colVertical5, .colVertical6, .colVertical7").forEach(function (btn) {
            btn.disabled = false;
          });
          // Cuando a acabado la animacion declaramos que la animación ya acabado: "false".
          isAnimating = false;
          if (player2.isCPU && player.idJugador == 1) {
            isAnimating = true;
            CpuMove();
          }
        }
      }
    }
  }

  animateClosure(position)();
}


/*  *** drawGird ***
    Aquí es donde dibujamos el tablero, que basicamente utilizamos las cordenadas del div del "tablero" 
    del canvas, añadimos el color del fondo y muy importante, creamos los ciruclos. En la parte de los ciruclos
    utilizamos el atributo de canvas llamado "globalCompositeOperacion", que este tiene las opciones
    "source-over" y "destination-out" que estas se ocupan que al crear el ciruclo el area de este sea transparente,
    para que cuando dibujemos las bolas con el otro canvas se vean por debajo.
*/
function drawGrid() {
  for (let x = 0; x <= tablero.width; x += 72) {
    for (let y = 0; y <= tablero.height; y += 83) {
      contextTablero.globalCompositeOperation = "source-over"; // Reiniciamos el fondo transparente.
      contextTablero.fillStyle = "#4682B4"; // background color del tablero.
      contextTablero.fillRect(x, y, 72, 83);

      // Dibujar el contenido del círculo en blanco y las cordenadas para que ocupen el tamaño lo mas parecido al circulo.
      contextTablero.beginPath();
      contextTablero.arc(x + 35, y + 42, 25, 0, 2 * Math.PI);
      contextTablero.globalCompositeOperation = "destination-out";

      // Aquí como no aplicamos ningun color de fondo y hacemos fill, sera transparente por la opción nombrada antes.
      contextTablero.fill();

      // Dibujar.
      contextTablero.beginPath();

    }
  }
}

/*  *** checkWinner ***
    Esta funcion verifica que el jugador que pasamos por parametro si tiene una linea vertical horizontal o diagonal de su mismo numero
    en las fitchas que tenemos delcaradas, primero instancia una matriz "board" que ocupa todo el tamaño del tablero, esto es para
    inicializarla.

    En el forEach de "posiciones", se recorre el array posiciones que contiene las posiciones actuales de las fichas en el tablero. 
    Para cada posición ocupada, se actualiza la matriz board con el ID del jugador que ocupa esa posición. Asi ahora el "board",
    contiene las posiciones donde los jugadores tienen asignada la fitcha.

    El metodo "isWinningLine" se ocuoa de verificar si la variable que creamos tiene 4 numeros seguidos del id de jugador en la fitcha,
    es decir si en cualquier dirección tiene 4 numeros consecutivos, los cuales las fitchas tienen el mismo id de jugador, se declara que ha ganado.
    Como solo hay dos jugadores solo comprueba el id "1" y "2".

    El metodo "getAllLines" lo que hace es generar todas las posibles lineas consecutivas ganadoras, todas las posiciones ganadoras.
*/
function checkWinner(player) {
  let board = [];
  for (let col = 0; col < 7; col++) {
    board[col] = [];
    for (let row = 0; row < 6; row++) {
      board[col][row] = null;
    }
  }

  // Asignamos en el tablero las fitchas de los jugadores.
  posiciones.forEach(posicion => {
    if (posicion.fitcha !== null) {
      board[posicion.col - 1][posicion.row - 1] = posicion.fitcha.idJugador;
    }
  });

  function isWinningLine(line) {
    const lineString = line.join('');
    return lineString.includes('1111') || lineString.includes('2222');
  }

  function getAllLines(board) {
    const lines = [];
    // Lineas horizontales.
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 4; col++) {
        lines.push([board[col][row], board[col + 1][row], board[col + 2][row], board[col + 3][row]]);
      }
    }
    // Lineas verticales.
    for (let col = 0; col < 7; col++) {
      for (let row = 0; row < 3; row++) {
        lines.push([board[col][row], board[col][row + 1], board[col][row + 2], board[col][row + 3]]);
      }
    }
    // Lineas diagonales hacia la derecha.
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        lines.push([board[col][row], board[col + 1][row + 1], board[col + 2][row + 2], board[col + 3][row + 3]]);
      }
    }
    // Lineas diagonales hacia la izquierda.
    for (let col = 0; col < 4; col++) {
      for (let row = 3; row < 6; row++) {
        lines.push([board[col][row], board[col + 1][row - 1], board[col + 2][row - 2], board[col + 3][row - 3]]);
      }
    }
    return lines;
  }

  /*  Aquí comrpueba si hay alguna linea ganadora, en el caso que no, habilita los botones para seguir la jugada.
      El for recorre todas las lineas y las comprueba si hay alguna ganadora. */
  const lines = getAllLines(board);
  for (const line of lines) {
    if (isWinningLine(line)) {
      document.getElementById(`colVertical1`).disabled = false;
      return true;
    }
  }

  return false;
}

/*  *** algoritmo minimax ***
    Este es el algoritmo minimax, por parametro le pasamos el jugador actual, el tablero "posiciones",
    cuanta profundidad busca el algoritmo (puede hasta 4), maximizingPlayer es para ver como bva el puntuaje del jugador
    actual que enviamos por parametro, y "alpha" y "beta" son variables que utiliza minimax para optimizar el funcionamiento y mejorar
    la eficiencia de busqueda. Esta funcion incluye recursión sobre ella misma.

    Recursión:

    Para cada posición disponible, se simula el movimiento del jugador actual en esa posición y se llama recursivamente a la función minimax, disminuyendo la profundidad en 1.
    Se utiliza la poda alfa-beta para eliminar los nodos innecesarios del árbol de búsqueda.
    Se evalúa el puntaje obtenido de la recursión y se actualiza maxScore o minScore según corresponda.
    Se actualiza bestMove con la columna que tiene el mejor movimiento.

    Retorno:

    Despues de calcular el mejor movimiento, devolvemos la columna, 
    que esta es la que se encarga el "selected()" de posicional la fitcha y asignarla al jugador.
*/
function minimax(currentPlayer, board, depth, maximizingPlayer, alpha, beta) {
  // Verificar si hay ganador o ya no hay más movimientos posibles.
  if (depth === 0 || checkWinner(player1) || checkWinner(player2)) {
    return -1; // Devolver -1 para indicar que no se encontró ningún movimiento válido.
  }

  let bestMove = -1; // Inicializar el mejor movimiento como -1, para empezar e inicializar.

  if (maximizingPlayer === currentPlayer) {
    let maxScore = -Infinity;
    for (const position of board) {
      if (position.fitcha === null) {
        position.fitcha = currentPlayer;
        const score = minimax(currentPlayer === player1 ? player2 : player1, [...board], depth - 1, false, alpha, beta);
        position.fitcha = null; // Deshacer el movimiento simulado para probar más movimientos.
        if (score > maxScore) {
          maxScore = score;
          bestMove = position.col;
        }
        alpha = Math.max(alpha, score);
        if (beta <= alpha) {
          break;
        }
      }
    }
    return maximizingPlayer === currentPlayer ? maxScore : bestMove;
  } else {
    let minScore = Infinity;
    for (const position of board) {
      if (position.fitcha === null) {
        position.fitcha = currentPlayer;
        const score = minimax(currentPlayer === player1 ? player2 : player1, [...board], depth - 1, true, alpha, beta);
        position.fitcha = null; // Deshacer el movimiento simulado para probar más movimientos.
        if (score < minScore) {
          minScore = score;
          bestMove = position.col;
        }
        beta = Math.min(beta, score);
        if (beta <= alpha) {
          break;
        }
      }
    }
    return bestMove; // Retornamos la columna del mejor movimiento.
  }
}

/*  *** reiniciarPartida ***
    Funcion para reiniciar la partida, basicamente refresca la ventana web.
*/
function reiniciarPartida() {
  location.reload();
}


// Nada más inicializar el script se crea el tablero, es lo primero.
drawGrid();
