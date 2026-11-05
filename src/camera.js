import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function Cam() {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [open, setOpen] = useState(false);
  const camRef = useRef(null);

  if (!permission) return <View />;

  if (!permission.granted) {
    return(
    <View style={styles.container}>
      <Text style={{ textAlign: "center" }}>
        Precisamos de permissão para exibir a câmera
      </Text>
      <Button onPress={requestPermission} title="Permitir" />
    </View>)
  }

  async function takePicture() {
    if (camRef.current) {
      const data = await camRef.current.takePictureAsync();
      setCapturedPhoto(data.uri);
      setOpen(true);
    }
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={camRef} >
        <TouchableOpacity style={styles.buttonTake} onPress={takePicture}>
          <MaterialIcons name="camera" size={60} color="white" />
        </TouchableOpacity>
      </CameraView>

      {capturedPhoto && (
        <Modal animationType="slide" transparent={true} visible={open}>
          <View style={styles.modal}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setOpen(false)}
            >
              <MaterialIcons name="close" size={40} color="red" />
            </TouchableOpacity>
            <Image style={styles.photo} source={{ uri: capturedPhoto }} />
          </View>
        </Modal>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  camera: { flex: 1 },
  buttonTake: {
    position: "absolute",
    bottom: 50,
    left: "40%",
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 30,
  },
  photo: {
    width: "100%",
    height: 400,
  },
});
