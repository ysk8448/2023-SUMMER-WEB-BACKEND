// console.log('Hello 2023 web!')                  
//const express = require('express');           

import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import cors from "cors"; //cors 불러오기 cors??

const pool = new pg.Pool({
    host: 'ls-28454caa543d9b1c136afdf7a8b39769b84a90e0.c0pmpy4hbgfq.ap-northeast-2.rds.amazonaws.com',
    user: 'dbmasteruser',
    password: '_.YU*H(yRP?ts+gms8aM!Z%b!>`=4&^X',
    database: 'postgres',
    port: 5432,
})

const app = express();

app.use(bodyParser.json());


const corsOptions = {
    origin: "http://localhost:5173",
      credentials: true,
  };
  
  app.use(cors(corsOptions))


// vist
let visit = 0;

app.get("/", (req, res) => {
    res.json({message: 'hello'})
});

app.delete('/student', async (req, res) => {
    const client = await pool.connect();
    
    const result = await client.query('delete from student where id = $1', [req.query.id]);

    client.release();
    
    res.json('삭제 완료');
});

//rest api
//get(메소드)은 주소가 중복되면 안됨
//메소드가 다르면 주소가 같아도 됨
//post는 body에 넣는다
app.post('/student',  async (req, res) => {
    // console.log(req.body);
    // res.json('hi');

    const client = await pool.connect(); //요청이 오면 db 연결
    
    const check = await client.query('select * from student where id = $1', [req.body.id]);

    if (check.rowCount === 0) {
        const result = await client.query( 'insert into student (id, gpa, name, major)  values ($1, $2, $3, $4)',
        [req.body.id, req.body.gpa, req.body.name, req.body.major]
        );
} else {
    const result = await client.query( 'update student set gpa = $1, name = $2, major = $3 where id = $4',
    [req.body.gpa,
     req.body.name,
     req.body.major,
     req.body.id]
     );
     res.json('hi');
};
});
    

    

app.get('/home', (req, res) => {
    visit += 1;
    res.json({message: 'hello home'})
});

app.get('/show', (req, res) => {
    res.json({message: `${visit}회`})
});

app.get('/student', async (req, res) => {
    const client = await pool.connect()

    // if (req.query.id );
    if ( req.query.id ) {
        //const result = await client.query("select * from student")

        // for (let i = 0; i < result.rows.length; i++) {
        //     if(result.rows[i].id == req.query.id ) {
        //         res.json(result.rows[i])
        //         break;
        //     } else {
        //         const result  = (await client.query("select * from student"))
        //         res.json(result.rows)
        //     }

        // }
        
        //2번째 방법 //그러나 구현만 되면 뭐든 노상관
        const result = await client.query(`select * from student where id = '${req.query.id}'`)
        const result2 = await client.query(
            "select * from student were id = $1" , 
            [req.query.id]
        )
        res.json(result.rows[0])
    }
    
    console.log(client)
    console.log(`student : ${req.query.id}`)
    const result  = (await client.query("select * from student"))
    res.json(result.rows)

});

app.listen(5005, () => {
    console.log('Server Open!')
})
//npm init
//npm install express --save
//node .\index.js
//node .\index.mjs 디렉토리에서 찾아서 실행
// localhost:5000 접속
//catrl c 서버 종료
//node.index.mjs

//get, post
//npm install --save body-parser