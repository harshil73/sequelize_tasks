const express = require("express");
const app = express();
const port = 7677 || PORT.process.env;

const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = new Sequelize("sequelize_test", "root", "root", {
  host: "127.0.0.1",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("connection established sucessfully!");
  })
  .catch((err) => {
    console.log(err);
  });

const image1 = require("./models/image1")(sequelize, DataTypes, Model);
const video1 = require("./models/video1")(sequelize, DataTypes, Model);
const tag = require("./models/tag")(sequelize, DataTypes, Model);
const taggable = require("./models/taggable")(sequelize, DataTypes, Model);

image1.belongsToMany(tag, {
  through: {
    model: taggable,
    unique: false,
    scope: {
      taggableType: "image",
    },
  },
  foreignKey: "taggableId",
  constraints: false,
});

tag.belongsToMany(image1, {
  through: {
    model: taggable,
    unique: false,
  },
  foreignKey: "tagId",
  constraints: false,
});

video1.belongsToMany(tag, {
  through: {
    model: taggable,
    unique: false,
    scope: {
      taggableType: "video",
    },
  },
  foreignKey: "taggableId",
  constraints: false,
});

tag.belongsToMany(video1, {
  through: {
    model: taggable,
    unique: false,
  },
  foreignKey: "tagId",
  constraints: false,
});

app.get('/adddata',async(req,res)=>{
    let imagedata = await image1.create({
        title:'handeercelposts.png',
        url:'www.handeercelposts.com'
    })

    // let videodata = await video1.create({
    //     title:'fight club',
    //     text:'hollywood '
    // })

    let tagdata = await tag.create({
        name:'hande ercel image'
    })
    // console.log(tagdata.id)

    if(imagedata.id && tagdata.id){
        let taggabledata = await taggable.create({
            tagId:tagdata.id,
            taggableId:imagedata.id,
            taggableType:'image'
        })
        res.send(taggabledata)
    }
})


// app.get('/readdata',async(req,res)=>{
//     // let data = await image1.findAll({
//     //     include:[tag]
//     // })
//     // res.send(data)

//     let data = await tag.findAll({
//         include:[image1,video1]
//     })
//     res.send(data)
// })


app.get('/deletedata',async(req,res)=>{
    let deleteddata = await image1.destroy({
        where:{id:1}
    },{
        include:[tag]
    })
    console.log(deleteddata)
    res.send(deleteddata)

    // image1.destroy(({where:{id:5}})).then((data)=>{
    //     console.log(data)
    //     taggable.destroy({where:{taggableId:5}}).then((data)=>{
    //         console.log(data)
    //     }).catch((err)=>{
    //         console.log(err)
    //     })
    // }).catch((err)=>{
    //     console.log(err)
    // })
})


//   image1.destroy({
//     where:{id:8}
// },{
//     include:[taggable]
// }).then((data)=>{
//     console.log('data deleted!',data)
// }).catch((err)=>{
//     console.log((err))
// })


// video1.destroy({
//     where:{
//         id:3
//     }
// },{
//     include: tag,
//   }).then((data)=>{
//     console.log(data)
//   }).catch((err)=>{
//     console.log(err)
//   });

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});