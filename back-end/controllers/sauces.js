// file system, pour modifier et supprimer des fichiers
const fs = require('fs');
const Sauces = require('../models/sauces');


exports.createSauces = (req, res, next) => {
  const saucesObject = JSON.parse(req.body.sauce);
  delete saucesObject._id;
  delete saucesObject._userId;
  const sauces = new Sauces({
      ...saucesObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0
  });
  sauces.save()
  .then(() => { res.status(201).json({message: 'sauce enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};
// appel d'une sauces avec request, result, next
exports.getOneSauces = (req, res, next) => {
  // demande à la base de donnés avec Find
  Sauces.findOne({
    _id: req.params.id
  }).then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauces = (req, res, next) => {
  const saucesObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete saucesObject._userId;
  Sauces.findOne({_id: req.params.id})
      .then((sauces) => {
          if (sauces.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Sauces.updateOne({ _id: req.params.id}, { ...saucesObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'sauce modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

exports.deleteSauces = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id})
      .then(sauces => {
          if (sauces.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = sauces.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Sauces.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'sauce supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

exports.getAllSauces = (req, res, next) => {
  Sauces.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

// Appel des likes avec request et result
exports.likeSauces = async (req, res) => {
  const likeStatus = req.body.like;
  const authUserId = req.auth.userId;
  const filterById = { _id: req.params.id };

  const addLike = {
    $inc: { likes: +1 },
    $push: { usersLiked: authUserId },
  };
  const addDislike = {
    $inc: { dislikes: +1 },
    $push: { usersDisliked: authUserId },
  };
  const removeLike = {
    $inc: { likes: -1 },
    $pull: { usersLiked: authUserId },
  };
  const removeDislike = {
    $inc: { dislikes: -1 },
    $pull: { usersDisliked: authUserId },
  };

  try {
    const sauces = await Sauces.findOne(filterById);
    switch (likeStatus) {
      case 1: {
        if (!sauces.usersLiked.includes(authUserId)) {
          await Sauces.findOneAndUpdate(filterById, addLike, { new: true });
          res.status(201).json({ message: `You like ${sauces.name} sauces ` });
        } else {
          return;
        }

        break;
      }
      case -1: {
        if (!sauces.usersDisliked.includes(authUserId)) {
          await Sauces.findOneAndUpdate(filterById, addDislike, { new: true });
          res.status(201).json({ message: `You dislike ${sauces.name} sauces` });
        } else {
          return;
        }

        break;
      }
      case 0: {
        if (sauces.usersLiked.includes(authUserId)) {
          await Sauces.findOneAndUpdate(filterById, removeLike, { new: true });
          res
            .status(201)
            .json({ message: `You removed your like on ${sauces.name}` });
        } else if (sauces.usersDisliked.includes(authUserId)) {
          await Sauces.findOneAndUpdate(filterById, removeDislike, {
            new: true,
          });
          res.status(201).json({
            message: `You removed your dislike on ${sauces.name} sauces`,
          });
        } else {
          return;
        }
        break;
      }
    }
  } catch (error) {
    res.status(400).json(error);
  }
};