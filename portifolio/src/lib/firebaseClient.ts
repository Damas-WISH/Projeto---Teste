import type { DocumentData, Timestamp, WithFieldValue } from 'firebase/firestore';
import { auth, db, storage } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

type FirestoreDocument<T extends DocumentData> = T & { id: string };

export interface PortfolioProjectInput {
  title: string;
  description: string;
  link: string;
  image?: string;
}

export interface PortfolioProjectRecord extends PortfolioProjectInput {
  createdAt: Date | Timestamp;
}

export interface PortfolioProject extends PortfolioProjectRecord {
  id: string;
}

function rethrowFirebaseError(action: string, error: unknown): never {
  console.error(`Erro ao ${action}:`, error);
  throw error;
}

// ==================== AUTENTICAÇÃO ====================

/**
 * Criar novo usuário
 */
export async function registerUser(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    rethrowFirebaseError('registrar', error);
  }
}

/**
 * Login de usuário
 */
export async function loginUser(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    rethrowFirebaseError('fazer login', error);
  }
}

/**
 * Logout
 */
export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    rethrowFirebaseError('fazer logout', error);
  }
}

// ==================== FIRESTORE ====================

/**
 * Adicionar documento a uma coleção
 */
export async function addDocument<T extends DocumentData>(collectionName: string, data: WithFieldValue<T>) {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    rethrowFirebaseError('adicionar documento', error);
  }
}

/**
 * Obter todos os documentos de uma coleção
 */
export async function getDocuments<T extends DocumentData>(
  collectionName: string
): Promise<FirestoreDocument<T>[]> {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const documents: FirestoreDocument<T>[] = [];
    querySnapshot.forEach((docSnapshot) => {
      documents.push({
        id: docSnapshot.id,
        ...(docSnapshot.data() as T),
      });
    });
    return documents;
  } catch (error) {
    rethrowFirebaseError('obter documentos', error);
  }
}

/**
 * Deletar documento
 */
export async function deleteDocument(collectionName: string, docId: string) {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error) {
    rethrowFirebaseError('deletar documento', error);
  }
}

// ==================== STORAGE ====================

/**
 * Fazer upload de arquivo
 */
export async function uploadFile(filePath: string, file: File) {
  try {
    const fileRef = ref(storage, filePath);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  } catch (error) {
    rethrowFirebaseError('fazer upload', error);
  }
}

/**
 * Obter URL de download de um arquivo
 */
export async function getFileURL(filePath: string) {
  try {
    const fileRef = ref(storage, filePath);
    return await getDownloadURL(fileRef);
  } catch (error) {
    rethrowFirebaseError('obter URL', error);
  }
}

// ==================== EXEMPLO DE USO ====================

/**
 * Exemplo: Adicionar projeto ao portfólio
 */
export async function addPortfolioProject(projectData: PortfolioProjectInput) {
  return await addDocument<PortfolioProjectRecord>('projects', {
    ...projectData,
    createdAt: new Date(),
  });
}

/**
 * Exemplo: Obter todos os projetos
 */
export async function getPortfolioProjects() {
  return await getDocuments<PortfolioProjectRecord>('projects');
}
