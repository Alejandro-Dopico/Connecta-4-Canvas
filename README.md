**Connecta 4 - Connect Four**
Resumen

En el proyecto de Conecta 4, he optado por implementarlo utilizando objetos como base. Esta elección se debe a mi visión de que sería más escalable a futuro. En este enfoque, genero todas las posiciones posibles del tablero, permitiendo que a cada posición se le pueda asignar una ficha, la cual luego puede ser asociada a un jugador. La generación de todas las posiciones tiene como objetivo principal almacenarlas en una matriz con columnas y filas para facilitar la iteración. Dentro de estas posiciones, guardamos sus coordenadas (X e Y) para luego poder representarlas visualmente en el tablero y crear animaciones.

Clases y Objetos
El código comienza definiendo tres clases: Ficha, Posicion y Jugador. Estas clases se utilizan para modelar las fichas, las posiciones en el tablero y los jugadores, respectivamente. Cada una de estas clases tiene atributos específicos que representan diferentes aspectos del juego.

**Funciones Principales**
· generarPosiciones(numColumnas, numFilas, startX, startY, spacingX, spacingY): Esta función se encarga de generar las posiciones en el tablero, utilizando los parámetros proporcionados para determinar el tamaño y la distribución de las fichas.

**· **iniciarPartida(): Se ejecuta al inicio de una partida entre dos jugadores. Habilita el panel de juego y muestra el turno del primer jugador.

**· **iniciarPartidaConCPU(eleccion): Similar a iniciarPartida(), pero permite iniciar una partida contra la CPU. Dependiendo de la elección del jugador, puede comenzar el juego automáticamente con la CPU realizando su primer movimiento.

**· **alternatePlayer(colSelectedButton): Controla el cambio de turno entre los jugadores en el juego. También gestiona la lógica para verificar si una columna está llena antes de permitir que se coloque una ficha.

**·** selected(player, columnSelected): Se llama cuando un jugador selecciona una columna para colocar una ficha. Verifica si la columna está llena y, si no lo está, coloca la ficha del jugador en la posición correspondiente y actualiza el tablero.

**Funciones Auxiliares**

**·** updateBoard(): Actualiza la representación del tablero con las fichas colocadas en él.

**· **drawBall(position, player): Dibuja una ficha en el tablero, animándola para que caiga desde la parte superior de la columna seleccionada hasta la posición correspondiente.

**Algoritmo Minimax**
**· **minimax(board, depth, alpha, beta, maximizingPlayer): Implementa el algoritmo minimax para determinar el mejor movimiento posible para la CPU. Utiliza una heurística para evaluar las posiciones del tablero y seleccionar la mejor jugada.
**· **evaluateBoard(board): Evalúa el estado del tablero y asigna una puntuación basada en las configuraciones de fichas actuales. Esta función es utilizada por el algoritmo minimax para determinar el valor de cada posición.
**· **bestMove(board): Determina el mejor movimiento posible para la CPU mediante la aplicación del algoritmo minimax. Retorna la columna donde la CPU debería colocar su ficha para obtener la mejor ventaja.

**Pseudocodigo minimax**
Para ayudarme a comprender como funcionaba el minimax me he mirado varios videos, al final he optado por seguir su pseudocodigo en wikipedia:
```Javascript
function minimax(node, depth, maximizingPlayer) is
    if depth = 0 or node is a terminal node then
        return the heuristic value of node
    if maximizingPlayer then
        value := −∞
        for each child of node do
            value := max(value, minimax(child, depth − 1, FALSE))
        return value
    else (* minimizing player *)
        value := +∞
        for each child of node do
            value := min(value, minimax(child, depth − 1, TRUE))
        return value
(* Initial call *)
minimax(origin, depth, TRUE)
```
Estrategia aplicada para verificar el ganador:
La función checkWinner es crucial para verificar si un jugador ha ganado la partida al lograr una línea de cuatro fichas consecutivas, tanto vertical, horizontal como diagonalmente. Además, esta función se utiliza para determinar si el siguiente movimiento puede llevar a la victoria o si es necesario defenderse de un movimiento ganador del oponente.
Es decir tiene dos utilidades “**checkWinner**”:
Verificar ganador
Para comprobar si hay un ganador o no, como tenemos una matriz con los valores de las fichas he iterado 4 veces esta matriz mirando hacia todas las direcciónes; horizontal, vertical, diagonal derecha y diagonal izquierda.
```Javascript
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
```
Esto suma al objeto “**lines**”, todas las 4 posibles rectas donde se establece el ganador, en cada una de las 4 iteraciones, entonces este devolverá el resultado de estas.
Si encuentra una línea con “**1111**” o “**2222**” consecutivos devolverá un true, porque esto significa que en la matriz ha encontrado una línea ganadora que esta acabara la partida.

Comprobar si gana siguiente jugada

Para que la CPU tapara al jugador y si fuese a ganar en el siguiente movimiento hiciera ese implemente con el checkWinner que hiciera un movimiento simulado y que en el caso de ganar o que fuera a perder, devolviese esa posición de [col][row], para que la máquina pudiese defenderse o atacar a la perfección.

Eso precisamente es lo que hace el minimax, pero fue de lo primero que implemente y he dejado la doble verificación así la CPU es más eficiente y más difícil.


Código en la parte de la simulación:
```Javascript
// Simular el movimiento del jugador 2
      board[col][row] = 2; // La máquina es el jugador 2
      // Comprobar si este movimiento resulta en una victoria inmediata, si es asi devuelve ese movimiento-
      if (checkWinner(board, player2.idJugador)) {
        board[col][row] = null;
        return { col: col, row: row };
      }
      board[col][row] = null;


      // Comprueba si en la siguiente jugada puede ganar el jugador 1. Si va a ganar lo defiende.
      board[col][row] = 1;
      if (checkWinner(board, player1.idJugador)) {
        board[col][row] = null;
        return { col: col, row: row };
      }
      board[col][row] = null;
      board[col][row] = 2;


      // Calcular la puntuación del movimiento utilizando la función minimax para obtener una buena jugada.
      let score = minimax(board, 6, alpha, beta, false);
      board[col][row] = null;

```
Además que luego minimax, dependiendo del puntaje hará una estrategia a otra, estas dos utilidades son independientes del minimax, pero predomina la decisión de defender y ganar, ya que no hará el minimax en esos casos, ya que hay un return.
