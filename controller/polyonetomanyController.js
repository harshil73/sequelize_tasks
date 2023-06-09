const { Sequelize, DataTypes, Model, Op } = require("sequelize");
let sequelize = require('../database/connection')


const image = require("../models/image")(sequelize, DataTypes, Model);
const video = require("../models/video")(sequelize, DataTypes, Model);
const comment = require("../models/comment")(sequelize, DataTypes, Model);

video.hasMany(
    comment,
    {
      foreignKey: "commenttableId",
      constraints: false,
      scope: {
        commenttableType: "video",
      },
    },
    { through: "comments" }
  );
  comment.belongsTo(video, { foreignKey: "commenttableId", constraints: false });
  
  image.hasMany(
    comment,
    {
      foreignKey: "commenttableId",
      constraints: false,
      scope: {
        commenttableType: "image",
      },
    },
    { through: "comments" }
  );
  comment.belongsTo(image, { foreignKey: "commenttableId", constraints: false });


  const adddata = async (req, res) => {
    image
    .create({ title: "my photos", url: "phone/gallery/camara" })
    .then((imagedata) => {
      // console.log(imagedata.id);
      if (imagedata.id) {
        comment.create({
          commenttableType: "image",
          commenttableId: imagedata.id,
        });
      }
      return res.status(200).send(imagedata)
    })
    .catch((err) => {
      console.log(err);
    });
  };

const addvideodata = async(req,res)=>{
    video.create({title:'rise of tata',text:'all about sir ratan tata'}).then((videodata)=>{
    console.log(videodata.id)
    image.create({title:'sdsdd', url:'fdfdf'}).then((imagedata)=>{
      console.log(imagedata.id)
         if(videodata.id && imagedata.id){
          comment.create({commenttableType:'image',commenttableId:imagedata.id})
          comment.create({commenttableType:'video',commenttableId:videodata.id})
         }
    }).catch((err)=>{
      console.log(err)
    })
}).catch((err)=>{
    console.log(err)
})
}


  const readdata = async(req,res)=>{
    //    const data = await image.findOne({
    //   where:{
    //  title:'sdsdd'
    //   },
    // include: [comment]
    // });
  
    const data = await image.findAll({
      include: [comment]
    });
    res.send(data)
  }

const deletedata = async(req,res)=>{
  const data = await image.destroy({
    where:{id:2}
  },{
    include: [comment]
  })
  console.log(data);
  res.send('Data Deleted successfully!');
}


  module.exports = {adddata,addvideodata,readdata,deletedata}