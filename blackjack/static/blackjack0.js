function deal (){
  if(deck.list.length < 30){
    deck.shuffle_deck();
  }
  console.log(user.total);
  user.make_bet();
  $("#messages").text("");
  $("#deal-button").hide();
  $("#hit-button").show();
  $("#stand-button").show();
  dealerHand.clean();
  playerHand.clean();
  $("img").remove();
  for(var i = 0; i < 2; i++){
    playerHand.add(deck);
    dealerHand.add(deck);
  }
  playerHand.display("#player-hand",0);
  dealerHand.display_dealer();
  dealerHand.points_dealer()
  playerHand.points()
  $("#dealer-points").text(dealerHand.total);
  $("#player-points").text(playerHand.total);
}

function hit (){
  playerHand.add(deck);
  playerHand.display("#player-hand", playerHand.list.length-1);
  playerHand.points();
  $("#player-points").text(playerHand.total);
  if (playerHand.total > 21){
    $("#messages").text("You lost!");
    $("#hit-button").hide();
    $("#stand-button").hide();
    $("#deal-button").show();
  }
}

function stand (){
  $("#hidden").remove();
  dealerHand.points();
  while (dealerHand.total < 17){
    if(playerHand.list.length === 2 && playerHand.total === 21 && dealerHand.total !== 21){
      break;
    }
    else{
      dealerHand.add(deck);
      dealerHand.points();
    }
  };
  $("#dealer-points").text(dealerHand.total);
  playerHand.points();
  dealerHand.display("#dealer-hand",1);
  if (playerHand.total > dealerHand.total){
    $("#messages").text("You won!");
    user.total += 2 * user.bet;
    if(playerHand.list.length === 2 && playerHand.total === 21){
      console.log('blackjack');
      user.total += 0.5 * user.bet;
    }
  }
  else if(dealerHand.total > 21){
    user.total += 2 * user.bet;
    $("#messages").text("You won!");
  }
  else if(playerHand.list.length === 2 && playerHand.total === 21 && dealerHand.total === 21 && dealerHand.list.length > 2){
    user.total += 2 * user.bet;
    $("#messages").text("You won!");
  }
  else if(dealerHand.list.length === 2 && dealerHand.total === 21 && playerHand.total === 21 && playerHand.list.length > 2){
    user.total += 2 * user.bet;
    $("#messages").text("You won!");
  }
  else if(dealerHand.total === playerHand.total){
    $("#messages").text("It's a draw!");
    user.total += user.bet;
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

class Card {
  constructor (point, suit, url, value) {
    this.point = point;
    this.suit = suit;
    this.url = url;
    this.value = value;
  }
  create_info() {
    if (this.point > 10){
      this.value = 10;
      if (this.point === 11){
        this.url = "<img src='/static/cards/jack_of_" + this.suit +".png' height='80px' width='80px'/>";
      }
      else if (this.point === 12){
        this.url = "<img src='/static/cards/queen_of_" + this.suit +".png' height='80px' width='80px'/>";
      }
      else if (this.point === 13){
        this.url = "<img src='/static/cards/king_of_" + this.suit +".png' height='80px' width='80px'/>";
      }
    }
    else if (this.point === 1){
      this.value = this.point;
      this.url = "<img src='/static/cards/ace_of_" + this.suit +".png' height='80px' width='80px'/>";
    }
    else{
      this.value = this.point;
      this.url = "<img src='/static/cards/"+ this.point +"_of_" + this.suit +".png' height='80px' width='80px'/>";
    }
  }
}

class Hand {
  constructor(){
    this.list = [];
    this.total = 0;
  }
  points (){
    this.total = 0;
    this.list.sort(function(a, b){return b-a});
    var count = 0;
    for (var i = 0; i < this.list.length; i++){
      if (this.list[i].value === 1){
        count += 1;
      }
      else{
        this.total += this.list[i].value;
      }
    }
    if (count>0){
      if (10 + count + this.total > 21){
        this.total += count;
      }
      else{
        this.total += 10 + count;
      }
    }
  }

  points_dealer (){
    if (this.list[0].value === 1){
      this.total += 11;
    }
    else{
      this.total += this.list[0].value;
    }
  }

  display (id, start){
    for (var i = start; i < this.list.length; i++){
      $(id).append(this.list[i].url);
      $(id).find(":last-child").hide().fadeIn(1000,"swing");
    }
  }
  display_dealer (){
    $("#dealer-hand").append(this.list[0].url);
    $("#dealer-hand").find(":last-child").hide().fadeIn(1000,"swing");
    $("#dealer-hand").append("<img id='hidden' src='/static/cards/red_joker.png' height='80px' width='80px'/>");
    $("#dealer-hand").find(":last-child").hide().fadeIn(1000,"swing");
  }

  clean (){
    this.list = [];
    this.total = 0;
  }
  add(deck){
    var random_index = getRandomInt(0, deck.list.length-1);
    var card = deck.list[random_index];
    deck.list.splice(random_index,1);
    this.list.push(card);
  }
}

class Deck {
  constructor(){
    this.list = [];
    this.number = 1;
  }
  create_deck(){
    var suits = ["hearts", "diamonds", "clubs", "spades"];
    for(var k = 0; k < this.number; k++){
      for (var i = 0; i < 4; i++){
        for (var j = 1; j < 14; j++){
          var card = new Card();
          card.suit = suits[i];
          card.point = j;
          card.create_info();
          this.list.push(card);
        }
      }
    }
  }
  shuffle_deck(){
    this.list = [];
    this.create_deck();
  }
}

class User {
  constructor(name){
    this.name = name;
    this.total = 0;
    this.bet = 1;
  }
  make_bet () {
    this.total -= this.bet;
  }
}

var dealerHand = new Hand();
var playerHand = new Hand();
var deck = new Deck();
deck.number = 1;
deck.create_deck();
var user = new User();
user.total = 10;

$(document).ready(function (){
  $("#hit-button").hide();
  $("#stand-button").hide();
  $(".buttons").on("click", "#hit-button", hit);
  $(".buttons").on("click", "#deal-button", deal);
  $(".buttons").on("click", "#stand-button", stand);
});
