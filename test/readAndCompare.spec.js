
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
    // console.log(dbData);
    const jsonData = getJsonData();

    const updateArray = [];

    for(let dbItem of dbData){
        if(dbItem.id >= 3760){
            updateArray.push(dbItem);
        }
    }
    // console.log(updateArray);


    const updateArray2 = [];
    let count = 0;
    for(let jsonItem of jsonData){
        // console.log(item);
        let result = false;
        let id = 0;
        for(let item of updateArray){
            if(jsonItem.name === item.name && jsonItem.address === item.address){
                result = true;
                id = item.id;
            }
        }
        if(result){

            const resInfo = { 
                restaurant_id: "",
                close_day:"",
                start_time:"",
                end_time:"",
                memo:"",
                menu: [],
                images:[]
            };

            resInfo.restaurant_id = id;
            //     // 매장 이름


            // 매장 영업시간
            if(jsonItem.business_hour.open_hour.length > 0){
                resInfo.start_time = jsonItem.business_hour.open_hour[0].start_time;
                resInfo.end_time = jsonItem.business_hour.open_hour[0].end_time;
            }

            // 휴무, 특이사항 
            if(jsonItem.business_hour.closed.length > 0){
                resInfo.close_day = jsonItem.business_hour.closed[0].day.join(",");
                resInfo.memo = jsonItem.business_hour.closed[0].memo ? jsonItem.business_hour.closed[0].memo : "";
            }

            resInfo.menu = jsonItem.menu;

            resInfo.images = jsonItem.images;
            updateArray2.push(resInfo);
        }
    }
    // console.log(updateArray2);

    let query = `insert into p_restaurant_images(restaurant_id, image_path, preview_image_path) values`;
    for(let item of updateArray2){
        // console.log(item.restaurant_id);
        // console.log(item.close_day);
        // console.log(item.images);

        if(item.images.image_list.length > 0 ){
            for(let image of item.images.image_list){
                query += `(${item.restaurant_id}, '${image}', '${"preview_"+image}'),\n`;
            }
        }
    }

    const _q = query.slice(0, -2);
    
    console.log(_q);
    
    await queryBuilder(_q)
        .catch(err => {
            console.log(err);
            throw new Error(err);
        });
    
    console.log("success insert");
}



canReadAndCompare();

// if(!isOverlap){

