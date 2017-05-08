/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   03-05-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 08-05-2017
 */

import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Searchbar } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Store, Action } from '@ngrx/store'
import { Observable } from 'rxjs/Rx';

import { AppStateI } from "../../store/app-stats";
import { ICategoriesState } from '../../store/reducers/categoriesReducer';
import { MainActions } from '../../store/actions/mainActions';

import { ICON_DATAS, IconI } from './iconDatas'

/**
 * Generated class for the ItemModal component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
 @IonicPage({
   name: 'ItemModal',
   segment: 'item-modal'
 })
@Component({
  selector: 'item-modal',
  templateUrl: 'item-modal.html'
})
export class ItemModal{

  public uid:string;
  public form: FormGroup;
  public coords:{lat:number,lng:number};
  public isVisible:boolean = false;
  public isMore:boolean = false;
  public icons:IconI[] = ICON_DATAS;
  public selectedColor:{el:any,color:string} =  {el:null, color:null};
  public storeInfo:Observable<AppStateI>;
  public categoriesArray:Observable<ICategoriesState>;
  @ViewChild('searchbar') searchbar:Searchbar;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public fb: FormBuilder,
    private store: Store<any>,
    private mainActions: MainActions
  ) {
    this.coords = this.navParams.get('coords')
    this.categoriesArray = this.store.select((state:AppStateI) => state.categoriesArray)
    this.storeInfo = this.store.select((state:any) => state.currentUser )
    this.storeInfo.subscribe((state:any)=>{
      console.log('sub state->', state.currentUser._id)
      if(state.currentUser){
        this.uid = state.currentUser._id
      }
    })
    this.form = fb.group({
        description: ['', Validators.minLength(2)],
        category: ['', Validators.required],
      });
  }


  moreColore(){
    this.isMore = !this.isMore
    this.selectedColor = Object.assign({},{el:null, color:null})
  }

  choseColor(svg, color){
    if(this.selectedColor.el && this.selectedColor.el.style.fillOpacity){
      if(this.selectedColor.el.style.fillOpacity != 1){
        this.selectedColor.el.style.fillOpacity = 1;
      }
      else {
        this.selectedColor.el.style.fillOpacity = 0.1
      }
    }
    if(color){
      svg.style.fillOpacity = 0.1;
    }

    this.selectedColor = Object.assign({},{el:svg, color:color})
    console.log(this.selectedColor,color)
  }

  autoComplet():void{
    // Reset items back to all of the items
    this.categoriesArray = this.store.select((state:AppStateI) => state.categoriesArray)
    // set val to the value of the searchbar
    let val:string = this.form.value.category;
    (val.length>1 )? this.isVisible = true : this.isVisible = false;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.categoriesArray =  this.categoriesArray.map((item) => {
        return item.filter((item) => {
                  return(item.title.toLowerCase().indexOf(val.toLowerCase()) > -1)
                });
      });
      //(this.categoriesArray.length<=0)? this.isVisible = false : null;
    }
  }

  toogleSearch(item){
    //console.log(item, this.searchbar._value)
    this.isVisible = !this.isVisible
    this.form.value.category = item._id
    this.searchbar._value = item.title
    this.searchbar.setFocus()
  }

  save():void{
    console.log('save', this.form.value)
    let newItem = this.form.value;
    newItem.coords = {lat: this.coords.lat,lng: this.coords.lng};
    newItem.datetime = Date.now();
    newItem.user_id = this.uid;
    delete newItem.lat;
    delete newItem.lng;

    console.log('save item ready->', newItem)

    if(!this.selectedColor.el){
      this.store.dispatch(<Action>this.mainActions.create_data( { path: '/items', params: newItem} ));
    }
    else {
      let newCategory = {
        title: this.form.value.category,
        color: this.selectedColor.color,
        coords: this.selectedColor.el.children[0].attributes[1].value,
        user_id: this.uid,
      }
      console.log('save category ready->', newCategory)
      // then send the todo ready to DatasService
      this.store.dispatch(<Action>this.mainActions.create_category( { path: '/categories', params: {cat:newCategory, item: newItem}} ));

    }
    // back to home page 
    this.dismiss()
  }

  dismiss() {
    let data = { 'foo': 'bar' };
    this.viewCtrl.dismiss(data);
  }
}