import { auth, db, storage } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// ==================== AUTENTICAÇÃO ====================

/**
 * Criar novo usuário
 */
export async function registerUser(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Erro ao registrar:', error);
    throw error;
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
    console.error('Erro ao fazer login:', error);
    throw error;
  }
}

/**
 * Logout
 */
export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
}

// ==================== FIRESTORE ====================

/**
 * Adicionar documento a uma coleção
 */
export async function addDocument(collectionName: string, data: any) {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar documento:', error);
    throw error;
  }
}

/**
 * Obter todos os documentos de uma coleção
 */
export async function getDocuments(collectionName: string) {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const documents: any[] = [];
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return documents;
  } catch (error) {
    console.error('Erro ao obter documentos:', error);
    throw error;
  }
}

/**
 * Deletar documento
 */
export async function deleteDocument(collectionName: string, docId: string) {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error) {
    console.error('Erro ao deletar documento:', error);
    throw error;
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
    console.error('Erro ao fazer upload:', error);
    throw error;
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
    console.error('Erro ao obter URL:', error);
    throw error;
  }
}

// ==================== EXEMPLO DE USO ====================

/**
 * Exemplo: Adicionar projeto ao portfólio
 */
export async function addPortfolioProject(projectData: {
  title: string;
  description: string;
  link: string;
  image?: string;
}) {
  return await addDocument('projects', {
    ...projectData,
    createdAt: new Date(),
  });
}

/**
 * Exemplo: Obter todos os projetos
 */
export async function getPortfolioProjects() {
  return await getDocuments('projects');
}
