require('dotenv').config();
const oracledb = require('oracledb');

let person = {
  name: "Abhijeet",
  age: 25,
  country: "India",
  Id: 65894751282,
  isDeveloper: true,
  greet: function () {
    console.log("Hello!");
  },
  uuid: function () {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
};

async function sendOTPToUser(name) {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectionString: process.env.DB_CONNECTION_STRING,
    });

    const result = await connection.execute(
      `SELECT phone_number FROM users WHERE name = :name`,
      [name]
    );

    if (result.rows.length > 0) {
      const phoneNumber = result.rows[0][0];
      const otp = person.uuid();

      console.log(`✅ OTP ${otp} sent to ${phoneNumber}`);
    } else {
      console.log("❌ User not found.");
    }

  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    if (connection) await connection.close();
  }
}

console.log("Name: " + person.name);
console.log("Age: " + person.age);
sendOTPToUser(person.name);
