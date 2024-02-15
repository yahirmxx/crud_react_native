import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Text, StyleSheet, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Form = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [modalEditData, setModalEditData] = useState(null);

  useEffect(() => {
    obtenerDatosGuardados();
  }, []); 

  const handleEnviar = async () => {
    try {
      await AsyncStorage.setItem("nombre", nombre);
      await AsyncStorage.setItem("email", email);

      console.log("Nombre guardado:", nombre);
      console.log("Email guardado:", email);

      obtenerDatosGuardados();

      setModalVisible(true);
    } catch (error) {
      console.error("Error al guardar los datos:", error);
    }
  };

  const obtenerDatosGuardados = async () => {
    try {
      const nombreGuardado = await AsyncStorage.getItem("nombre");
      const emailGuardado = await AsyncStorage.getItem("email");

      const newData = [...modalData];
      newData.push({ nombre: nombreGuardado, email: emailGuardado });
      setModalData(newData);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const handleBorrar = async (index) => {
    try {
      await AsyncStorage.removeItem("nombre");
      await AsyncStorage.removeItem("email");

      const newData = [...modalData];
      newData.splice(index, 1);
      setModalData(newData);
    } catch (error) {
      console.error("Error al borrar los datos:", error);
    }
  };

  const handleActualizar = async (index) => {
    try {
      const updatedData = [...modalData];
      updatedData[index] = { nombre, email };
      setModalData(updatedData);
      await AsyncStorage.setItem("nombre", nombre);
      await AsyncStorage.setItem("email", email);
      setModalEditData(null);
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crud de usuarios</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        onChangeText={setNombre}
        value={nombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
      />
      <Button title="Enviar" onPress={handleEnviar} />
      <Button
        title="Ver datos"
        onPress={() => setModalVisible(true)}
        color="green"
        style={styles.button}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Datos guardados:</Text>
          {modalData.map((item, index) => (
            <View key={index} style={styles.modalItem}>
              {modalEditData === index ? (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Nombre"
                    onChangeText={setNombre}
                    value={nombre}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    onChangeText={setEmail}
                    value={email}
                    keyboardType="email-address"
                  />
                  <Button
                    title="Guardar"
                    onPress={() => handleActualizar(index)}
                  />
                </>
              ) : (
                <>
                  <Text style={styles.modalText}>Nombre: {item.nombre}</Text>
                  <Text style={styles.modalText}>Email: {item.email}</Text>
                  <Button
                    title="Borrar"
                    color="red"
                    onPress={() => handleBorrar(index)}
                  />
                  <Button
                    title="Actualizar"
                    onPress={() => setModalEditData(index)}
                  />
                </>
              )}
            </View>
          ))}
          <Button title="Cerrar" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalTitle: {
    marginBottom: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  modalItem: {
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: "white",
  },
  button: {
    marginTop: 10,
  },
});

export default Form;
