function deal (){
  if(deck.length < 30){
    shuffle_deck(number);
  }
  $("#messages").text("");
  $("#deal-button").hide();
  $("#hit-button").show();
  $("#stand-button").show();
  dealerHand = [];
  playerHand = [];
  dealerHidden = {point: [], name: ''};
  $("img").remove();
  for(var i = 0; i < 2; i++){
    var card = get_card(deck);
    playerHand.push(card.point);
    $("#player-hand").append("<img src='/static/cards/" + card.name + "' height='80px' width='80px'/>");
    var card = get_card(deck);
    if (i === 0){
      $("#dealer-hand").append("<img src='/static/cards/" + card.name + "' height='80px' width='80px'/>");
    }
    else{
      $("#dealer-hand").append("<img id='hidden' src='/static/cards/red_joker.png' height='80px' width='80px'/>");
      dealerHidden.point.push(card.point);
      dealerHidden.name = card.name;
    }
    dealerHand.push(card.point);
  }
  var player_points = calculate_points(playerHand);
  var dealer_points = calculate_points(dealerHand);
  var hidden_points = calculate_points(dealerHidden.point);
  $("#dealer-points").text(dealer_points-hidden_points);
  $("#player-points").text(player_points);
}

function hit (){
  var card = get_card(deck);
  $("#player-hand").append("<img src='/static/cards/" + card.name + "' height='80px' width='80px'/>");
  playerHand.push(card.point);
  var points = calculate_points(playerHand)
  $("#player-points").text(points);
  if (points > 21){
    $("#messages").text("You lost!");
    $("#hit-button").hide();
    $("#stand-button").hide();
  }
}

function stand (){
  var points = 0;
  while (points < 17){
    if (dealerHand.length === 2){
      $("#hidden").remove();
      $("#dealer-hand").append("<img src='/static/cards/" + dealerHidden.name + "' height='80px' width='80px'/>");
    }
    points = calculate_points(dealerHand);
    if (points < 17){
      var card = get_card(deck);
      $("#dealer-hand").append("<img src='/static/cards/" + card.name + "' height='80px' width='80px'/>");
      dealerHand.push(card.point);
    }
    points = calculate_points(dealerHand);
    $("#dealer-points").text(points);
  };
  playerPoints = calculate_points(playerHand);
  if (playerPoints > points){
    $("#messages").text("You won!");
  }
  else if(points > 21){
    $("#messages").text("You won!");
  }
  else if(playerHand.length === 2 && playerPoints === 21 && points === 21 && dealerHand.length > 2){
    $("#messages").text("You won!");
  }
  else if(dealerHand.length === 2 && points === 21 && playerPoints === 21 && playerHand.length > 2){
    $("#messages").text("You won!");
  }
  else if(points === playerPoints){
    $("#messages").text("It's a draw!");
  }
  else{
    $("#messages").text("You lost!");
  }
  $("#hit-button").hide();
  $("#stand-button").hide();
  $("#deal-button").show();
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function get_card(deck){
  var random_index = getRandomInt(0, deck.length-1);
  var card = deck[random_index];
  deck.splice(random_index,1);
  var card_name;
  if (card.point === 1){
    card_name = "ace";
  }
  else if (card.point === 11){
    card_name = "jack";
  }
  else if (card.point === 12){
    card_name = "queen";
  }
  else if (card.point === 13){
    card_name = "king";
  }
  else{
    card_name = card.point;
  }
  card_name = card_name + "_of_" + card.suit + ".png";
  if (card.point >= 1 && card.point <= 10){
  }
  else{
    card.point = 10;
  }
  var card_info = {point: card.point, name: card_name};
  return card_info;
}

function create_deck(number){
  var deck = [];
  var suits = ["hearts", "diamonds", "clubs", "spades"];
  for(var k = 0; k < number; k++){
    for (var i = 0; i < 4; i++){
      for (var j = 1; j < 14; j++){
        var card = {point : j, suit : suits[i]}
        deck.push(card);
      }
    }
  }
  return deck;
}



function calculate_points(hand){
  hand.sort(function(a, b){return b-a});
  var total = 0;
  var count = 0;
  for (var i = 0; i < hand.length; i++){
    if (hand[i] === 1){
      count += 1;
    }
    else{
      total += hand[i];
    }
  }
  if (count>0){
    if (10 + count + total > 21){
      total += count;
    }
    else{
      total += 10 + count;
    }
  }
  return total;
}

function shuffle_deck(n){
  return create_deck(n);
}

var dealerHand = [];
var dealerHidden = {point: [], name: ''};
var playerHand = [];
var number = 3;
var deck = create_deck(3);

$(document).ready(function (){
  $("#hit-button").hide();
  $("#stand-button").hide();
  $(".buttons").on("click", "#hit-button", hit);
  $(".buttons").on("click", "#deal-button", deal);
  $(".buttons").on("click", "#stand-button", stand);
});
