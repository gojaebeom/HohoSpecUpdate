
const Client = require("pg").Client;
require("dotenv").config();

const client = new Client({
    host: process.env.PGSQL_HOST,
    user: process.env.PGSQL_USER,
    password: process.env.PGSQL_PASS,
    database: process.env.PGSQL_DB,
    port: Number(process.env.PGSQL_PORT),
    ssl: {
        rejectUnauthorized : false
    }
});

// DB 커넥터 : app.js에서 서버 실행시 호출
client.connect(err => { 
    if (err) {
        console.log(`Failed to connect db => ${err}`);
    } else {
        console.log("Connect to pg-db done!");
    } 
});


// 재사용성 쿼리빌더 : repository 에서 사용
const queryBuilder = ( query, values ) => {
    return new Promise((resolve, reject) => {
        client.query( query, values, ( err, result ) => {
            if(err) reject(err);
            else resolve(result);
        });
    });
}

const getDBData = async () => {
    const sql = "select * from p_restaurants";
    const res = await queryBuilder(sql)
        .then(data => data)
        .catch(err=>{
            throw new Error(err)
        });
    // console.log(res.rows.length);
    return res.rows;
}

const getJsonData = () => {
    return results = require("../assets/json/hoho_results.json");
}

const canReadAndCompare = async () => {
    const dbData = await getDBData();
    const jsonData = getJsonData();

    let overlapCount = 0;
    let unOverlapCount = 0;

    for(let jsonItem of jsonData){
        let isOverlap = false;
        for(let dbItem of dbData){


            if(dbItem.name === jsonItem.name){
                console.log(dbItem.id);


                let open_day = "";

                if(jsonItem.business_hour.open_hour.length > 0){
                    jsonItem.business_hour.open_hour.map(item=>{
                        console.log(item);
                        console.log(item.day.join(""));
                    });
                }
                // if(jsonItem.business_hour.closed.length > 0){
                //     jsonItem.business_hour.closed.map(item=>{
                //         console.log(item);
                //     });
                // }
            }
        }
        if(!isOverlap){
            unOverlapCount++;
        }
    }
    
    // console.log(overlapCount);
    // console.log(unOverlapCount);
}
canReadAndCompare();
