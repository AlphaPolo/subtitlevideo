
import { FirebaseApp } from "./config";
import { getStorage } from "firebase/storage";

const firestorage = getStorage(FirebaseApp);
 
export default firestorage;