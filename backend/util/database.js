const MongoDb = require("mongodb");
const MongoClient = MongoDb.MongoClient;

const MongoConnect=(callback)=>{
    MongoClient.connect(
        "mongodb://suryanshdwivedi615:GT7J8FxgWGXDnwDq@ac-xhp67ci-shard-00-00.14f6nog.mongodb.net:27017,ac-xhp67ci-shard-00-01.14f6nog.mongodb.net:27017,ac-xhp67ci-shard-00-02.14f6nog.mongodb.net:27017/?replicaSet=atlas-5013na-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Cluster0"
      )
        .then((client) => {
          console.log("Connected");
          callback(client)
        })
        .catch((err) => {
          console.log(err);
        });
      
};

module.exports=MongoConnect;

