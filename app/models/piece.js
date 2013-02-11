var Piece = function () {
  this.defineProperties({
    title: {type: 'string', required: true},
    description: {type: 'string', required: true},
    picture: {type: 'string', required: true},
    link: {type: 'string', required: true}
  });

};

Piece = geddy.model.register('Piece', Piece);