import React, { useEffect } from "react";
import { View, Text } from "react-native";
import SQLite from "react-native-sqlite-storage";

const App = () => {
  useEffect(() => {
    try {
          const databaseName = "SampleDatabase.db";
          const database = SQLite.openDatabase({
            name: databaseName,
            location: "default",
          });

          database.transaction((tx) => {
            tx.executeSql(
              "CREATE TABLE IF NOT EXISTS MyTable (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER)"
            );
          });

          database.transaction((tx) => {
            tx.executeSql(
              "INSERT INTO MyTable (name, age) VALUES (?, ?)",
              ["John Doe", 25],
              (tx, results) => {
                if (results.rowsAffected > 0) {
                  console.log("Data inserted successfully.");
                } else {
                  console.log("Failed to insert data.");
                }
              }
            );
          });

          database.transaction((tx) => {
            tx.executeSql("SELECT * FROM MyTable", [], (tx, results) => {
              const len = results.rows.length;
              if (len > 0) {
                for (let i = 0; i < len; i++) {
                  const row = results.rows.item(i);
                  console.log(
                    `ID: ${row.id}, Name: ${row.name}, Age: ${row.age}`
                  );
                }
              } else {
                console.log("No data found.");
              }
            });
          });

          database.close();
    } catch (error) {
        console.log("ERROR",error);
    }
  
  }, []);

  return (
    <View>
      <Text>SQLite Example</Text>
    </View>
  );
};

export default App;
