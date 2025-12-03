export function resolveBidding({
  bidP1,
  bidP2,
  P1money,
  P2money,
  currentMarker,
  useMarker
}) {
  let winner = null;

  //------------------------------------
  // 1. Decide winner
  //------------------------------------
  if (bidP1 > bidP2) {
    winner = "P1";

    P1money -= bidP1;
    P2money += bidP1;

  } else if (bidP2 > bidP1) {
    winner = "P2";

    P2money -= bidP2;
    P1money += bidP2;

  } else {
    // equal bids → marker-holder wins
    winner = currentMarker;

    if (currentMarker === "P1") {
      P1money -= bidP1;
      P2money += bidP1;
    } else {
      P2money -= bidP2;
      P1money += bidP2;
    }
  }

  //------------------------------------
  // 2. Marker consumption logic
  //------------------------------------
  let markerUsed = false;

  // CASE A — marker-holder toggled "use marker"
  // (Always consumes marker, regardless of win/loss)
  if (useMarker) {
    markerUsed = true;
  }

  // CASE B — bids equal (tie)
  // (Marker ALWAYS used to break tie)
  if (bidP1 === bidP2) {
    markerUsed = true;
  }

  //------------------------------------
  // 3. Marker transfer
  //------------------------------------
  let newMarkerHolder = currentMarker;

  if (markerUsed) {
    newMarkerHolder = currentMarker === "P1" ? "P2" : "P1";
  }

  //------------------------------------
  // 4. Return
  //------------------------------------
  return {
    winner,
    newP1money: P1money,
    newP2money: P2money,
    newMarkerHolder
  };
}
