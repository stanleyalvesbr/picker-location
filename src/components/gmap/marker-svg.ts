/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   11-05-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 11-05-2017
 */

 export const svg:Function = (color:string):string=> {return `
 <svg version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg"
   width="50"
   height="50"
   viewBox="0 0 50 50"
   overflow="inherit">
     <path
       fill="${color}"
       d="M25.015 2.4c-7.8 0-14.121 6.204-14.121 13.854 0 7.652 14.121 32.746 14.121 32.746s14.122-25.094 14.122-32.746c0-7.65-6.325-13.854-14.122-13.854z"/>
 </svg>`};
