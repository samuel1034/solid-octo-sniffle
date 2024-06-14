const toIndex = (req, res, next)=> {
  res.render('index', { 
    name: 'Kilber Hernández'
  });
};

module.exports = toIndex;