import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const POSTS = 'posts'
const PORTFOLIOS = 'portfolios'
const WEBLOGS = 'weblogs';
const IMAGES = 'images'

// Setup Firebase
const config = {
	apiKey: "AIzaSyD4WyDVLvJV1ZXAH2KOUQDs2JFtQjqv3Do",
    authDomain: "ssafy-web-pjt.firebaseapp.com",
    databaseURL: "https://ssafy-web-pjt.firebaseio.com",
    projectId: "ssafy-web-pjt",
    storageBucket: "ssafy-web-pjt.appspot.com",
    messagingSenderId: "363817638878",
    appId: "1:363817638878:web:aea49aa578e86b59"
}

firebase.initializeApp(config)
const firestore = firebase.firestore()

export default {
	postLogData(user, type){
		return firestore.collection(WEBLOGS).add({
			type: type,
			email: user.email,
			date: firebase.firestore.FieldValue.serverTimestamp()
		})
	},
	getPosts() {
		const postsCollection = firestore.collection(POSTS)
		return postsCollection
				.orderBy('created_at', 'desc')
				.get()
				.then((docSnapshots) => {
					return docSnapshots.docs.map((doc) => {
						let data = doc.data()
						data.created_at = new Date(data.created_at.toDate())
						return data
					})
				})
	},
	loadMorePosts() {

	},
	postPost(title, content) {
		return firestore.collection(POSTS).add({
			title,
			content,
			created_at: firebase.firestore.FieldValue.serverTimestamp()
		}).catch(function(error) {

			return "fail";
		})
	},
	getPortfolios() {
		const postsCollection = firestore.collection(PORTFOLIOS)
		return postsCollection
				.orderBy('created_at', 'desc')
				.get()
				.then((docSnapshots) => {
					return docSnapshots.docs.map((doc) => {
						let data = doc.data()
						data.created_at = new Date(data.created_at.toDate())
						return data
					})
				})
	},
	postPortfolio(title, body, img) {
		return firestore.collection(PORTFOLIOS).add({
			title,
			body,
			img,
			created_at: firebase.firestore.FieldValue.serverTimestamp()
		})
	},
	getImage() {
		const imagesCollection = firestore.collection(IMAGES)
		return imagesCollection
			.orderBy('created_at','desc')
			.get()
			.then((docSnapshots) => {
				return docSnapshots.docs.map((doc) => {
					let data = doc.data()
					data.created_at = new Date(data.created_at.toDate())
					return data
				})
			})
	},
	postImage(img) {
		return firestore.collection(IMAGES).add({
			// title,
			img,
			created_at: firebase.firestore.FieldValue.serverTimestamp()
		})
	},
	loginWithGoogle() {
		let provider = new firebase.auth.GoogleAuthProvider()
		return firebase.auth().signInWithPopup(provider).then(function(result) {

			return result
		}).catch(function(error) {
			console.error('[Google Login Error]', error)
		})
	},
	loginWithFacebook(){
		let provider = new firebase.auth.FacebookAuthProvider();

		return firebase.auth().signInWithPopup(provider).then(function(result) {
			return result;
		  }).catch(function(error) {
			console.error('[Facebook Login Error]', error)
		  });
	},
	loginWithEmail(email, password){
		return firebase.auth().signInWithEmailAndPassword(email, password).catch(err=>{
			let errorCode = err.code;

			if(errorCode == 'auth/invalid-email'){
				alert('Invalid email...');
			}else if(errorCode == 'auth/user-not-found' || errorCode == 'auth/wrong-password'){
				alert('아이디 또는 패스워드가 틀렸습니다.')
			}
			console.log('[Email Login Error]', err);
		})
	},
	signUpEmail(email, name, password){
		return firebase.auth().createUserWithEmailAndPassword(email, password).then(result=>{
			result.user.updateProfile({
				displayName: name
			});

			return result;
		}).catch(err=>{
			let errorCode = err.code;

			if(errorCode == 'auth/weak-password'){
				alert('The password is too weak.');
			}else if(errorCode == 'auth/invalid-email'){
				alert('Email is invalid.');
			}else if(errorCode == 'auth/email-already-in-use'){
				alert('"This account already exists...');
			}

			console.log(err);
		})
	},
	logout(){
		firebase.auth().signOut().then(()=>{
			console.log("[Success] logout");
		}).catch(err=>{
			console.log(err);
		});
	}
}