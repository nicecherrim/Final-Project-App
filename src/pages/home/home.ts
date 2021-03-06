import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FirebaseStoreProvider } from '../../providers/firebase-store/firebase-store'
import { AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/rx';
import { AlertController } from 'ionic-angular';
import { FirebaseAuthProvider } from '../../providers/firebase-auth/firebase-auth';
import * as firebase from 'firebase'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  items: Observable<any[]>;
  games: Observable<any[]>;
  currentGame: Observable<any>;
  constructor(public navCtrl: NavController, public firebaseProvider: FirebaseStoreProvider,public alertCtrl: AlertController, public auth: FirebaseAuthProvider ) {
    this.items = firebaseProvider.listItems();
    this.games = firebaseProvider.listGames();
    this.currentGame = null;
    //this.favoriteList = [];
    
  }
  addItem(){
    let prompt = this.alertCtrl.create({
      title: 'Add Item',
      message: "Add a new item",
      inputs: [
        {
          name: 'name',
          placeholder: 'Item name',
        },
        {
          name: 'description',
          placeholder: 'Description',
        },
        {
          name: 'price',
          placeholder: 'Price',
          type: 'number'
        },
        {
          name: 'atk',
          placeholder: 'Atk',
          type: 'number'
        },{
          name: 'def',
          placeholder: 'Def',
          type: 'number'
        },
        {
          name: 'magic',
          placeholder: 'Magic',
          type: 'number'
        },
        {
          name: 'magicDef',
          placeholder: 'Magic def',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: data => {
            this.firebaseProvider.addItem(data);
          }
        }
      ]
    });
    prompt.present();
  }

  deleteItem(title, id){
    const confirm = this.alertCtrl.create({
      title: 'Delete this item?',
      message: 'Do you really want to delete "' + title + '"?',
      buttons: [
        {
          text: 'Cancel', 
        },
        {
          text: 'Delete',
          handler: () => {
            this.firebaseProvider.deleteItem(id); 
          }
        }
      ]
    });
    confirm.present();
  }
  logout(){
    this.auth.signOut();
  }
  updateItem(item){
    let prompt = this.alertCtrl.create({
      title: 'Edit item',
      message: "Edit item data",
      inputs: [
        {
          name: 'name',
          placeholder: 'Item name',
        },
        {
          name: 'description',
          placeholder: 'Description',
        },
        {
          name: 'price',
          placeholder: 'Price',
          type: 'number'
        },
        {
          name: 'atk',
          placeholder: 'Atk',
          type: 'number'
        },{
          name: 'def',
          placeholder: 'Def',
          type: 'number'
        },
        {
          name: 'magic',
          placeholder: 'Magic',
          type: 'number'
        },
        {
          name: 'magicDef',
          placeholder: 'Magic def',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: data => {
            this.firebaseProvider.updateItem(item.id, data);
          }
        }
      ]
    });
    prompt.present();
  }
  createGame(){
    let prompt = this.alertCtrl.create({
      title: 'Add Game',
      message: "Start new game",
      inputs: [
        {
          name: 'name',
          placeholder: 'Game name',
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: data => {
            this.firebaseProvider.createGame(data, this.auth.user).then(
              game => {
                this.joinGame(game.id)
              }
            )
          }
        }
      ]
    });
    prompt.present();
  }
  joinGame(gameid){
    console.log(gameid)
    //var game =  this.firebaseProvider.getGame(gameid)
    // var gameData = game.snapshotChanges().map(doc => {
    //   return doc.payload.data()
    // })
    
    this.firebaseProvider.getGame(gameid).subscribe(
      game => {
        if(game.player2==null || game.player1==this.auth.getUID() || game.player2==this.auth.getUID()){
          this.currentGame = game;
          if(this.auth.getUID()!=game.player1){
            this.firebaseProvider.startGame(gameid, this.auth.getUID())
          }
        }
      }
    )
  }
  leaveGame(){
    this.currentGame = null;
  }
  
}