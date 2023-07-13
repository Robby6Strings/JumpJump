var j=Object.defineProperty;var Q=(i,e,t)=>e in i?j(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var n=(i,e,t)=>(Q(i,typeof e!="symbol"?e+"":e,t),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function t(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(r){if(r.ep)return;r.ep=!0;const o=t(r);fetch(r.href,o)}})();var x=(i=>(i[i.NONE=0]="NONE",i[i.CHANGED=1]="CHANGED",i[i.ADDED=2]="ADDED",i[i.REMOVED=3]="REMOVED",i))(x||{});class N{constructor(e,t){n(this,"_val");n(this,"_subscribers",new Set);n(this,"_name");this._val=e,this._name=t}get value(){return this._val}set value(e){this._val=e,this.notify()}notify(){for(const e of this._subscribers)e(this._val)}subscribe(e){return this._subscribers.add(e),this.logSubscriberCount(),e(this._val),()=>this.unsubscribe(e)}unsubscribe(e){this._subscribers.delete(e),this.logSubscriberCount()}serialize(){return JSON.stringify(this.value)}logSubscriberCount(){}}function D(i){return new N(i)}const Z=i=>{switch(i){case"className":return"class";default:return i}},_=i=>{const e={};return Object.keys(i).forEach(t=>{if(!t.includes(":")&&t!=="innerText"&&t!=="children"&&t!=="promise"){if(t==="className"){e.class=i[t];return}if(i[t]instanceof N){e[t]=i[t].value;return}e[t]=i[t]}}),e};class d{static updateElement(e){if(!e.element)return;const{htmlFor:t,children:s,onMounted:r,subscription:o,visible:l,style:a,promise:u,...h}=e.props,p=e.isSVG();if(a&&(typeof a=="object"?Object.assign(e.element.style,a):e.element.setAttribute("style",a)),t&&"htmlFor"in e.element&&(e.element.htmlFor=t),Object.keys(h).length){for(const[S,A]of Object.entries(h))if(!S.includes(":")&&S!=="hydrating"){if(S.startsWith("on")){Object.assign(e.element,{[S]:A});continue}p?e.element.setAttribute(Z(S),e.getPrimitive(A,()=>d.updateElement(e))):Object.assign(e.element,{[S]:e.getPrimitive(A,()=>d.updateElement(e))})}}}static getRenderedChildren(e){return e.children.map((t,s)=>d.renderChild(e,t,s))}static renderChildren(e){e.props.visible&&e.element&&(d.removeFuncComponents(e),e.element.replaceChildren(...d.getRenderedChildren(e)))}static renderChild(e,t,s){if(t instanceof N)return e.subscribeTo((r,o)=>t.subscribe(()=>{const{element:l}=e.element?{element:e.element}:d.getMountLocation(e);if(!l){console.error("Failed to get component mount element",e,t);return}const a=l.childNodes[s];a&&(a.nodeValue=t.value.toString())})),t.value.toString();if(t instanceof m)return!t.props.visible||t.isStatic?"":(t.parent=e,d.render(t));if(typeof t=="function"){let r=t(...e.childArgs);Array.isArray(r)&&(r=new G(r));const o=d.renderChild(e,r,s);if(r instanceof m){if(!r.props.visible||r.isStatic)return"";r.parent=e,e.funcComponents.push(r)}return o}return(t==null?void 0:t.toString())??""}static removeFuncComponents(e){if(e.funcComponents.length>0){for(const t of e.funcComponents)d.unRender(t),v.removeComponentReferences(t);e.funcComponents=[]}}static unRender(e,t=!1){var s;try{if(!t&&e.props.onBeforeUnmounted){const r=e.props.onBeforeUnmounted(e);if(r instanceof Promise){r.then(o=>{o&&d.unRender(e,!0)});return}else if(r===!1)return}if(d.removeFuncComponents(e),e.element)return e.unMount(),e.element.remove();for(const r of e.children)r instanceof m?d.unRender(r):r instanceof Node&&((s=r.parentNode)==null||s.removeChild(r))}catch(r){console.error("failed to unrender",e,r);debugger}}static reRender(e){if(!e.shouldRender())return;const t=e.element??d.render(e,!0);if(e.element&&d.renderChildren(e),t.isConnected)return;const{element:s,idx:r}=d.getMountLocation(e);if(!s){debugger;console.error("Failed to get component mount element",e,t);return}const o=s.childNodes[r-1];o?s.insertBefore(t,o):s.appendChild(t),e.mounted=!0}static render(e,t=!1){const{children:s,subscription:r,promise:o}=e.props;if(v.removeComponentReferences(e),!e.tag){const l=document.createDocumentFragment();return r&&e.subscribeTo(r),l.append(...d.getRenderedChildren(e)),e.mounted=!0,!t&&"setPromise"in e&&typeof e.setPromise=="function"&&e.setPromise(o),l}return e.tag.toLowerCase()==="svg"?d.svg(e):(e.element||(e.element=document.createElement(e.tag)),s&&e.replaceChildren(s),d.renderChildren(e),d.updateElement(e),r&&e.subscribeTo(r),e.mounted=!0,e.element)}static diffCheckChildren(e,t){const s=e.map(h=>h.props.key),r=t.map(h=>h.props.key),o=t.filter(h=>!s.includes(h.props.key)).map(h=>h.props.key),l=e.filter(h=>!r.includes(h.props.key)).map(h=>h.props.key),a=t.filter(h=>!o.includes(h.props.key)&&!l.includes(h.props.key)).filter(h=>{const p=e.find(S=>S.props.key===h.props.key);return JSON.stringify(p.props)!==JSON.stringify(h.props)}).map(h=>h.props.key),u=e.filter(h=>!o.includes(h.props.key)&&!l.includes(h.props.key)&&!a.includes(h.props.key)).map(h=>h.props.key);return[...o.map(h=>({result:x.ADDED,key:h,node:t.find(p=>p.props.key===h).element})),...l.map(h=>({result:x.REMOVED,key:h,node:e.find(p=>p.props.key===h).element})),...a.map(h=>({result:x.CHANGED,key:h,node:e.find(p=>p.props.key===h).element})),...u.map(h=>({result:x.NONE,key:h,node:e.find(p=>p.props.key===h).element}))]}static diffMergeChildren(e,t){const s=e.children;try{const r=d.diffCheckChildren(s,t);for(let o=0;o<r.length;o++){const l=r[o];switch(l.result){case x.ADDED:{const a=t.find(u=>u.props.key===l.key);e.insertChildren(t.indexOf(a),a);break}case x.REMOVED:{const a=e.children.find(u=>(u==null?void 0:u.props.key)===l.key);e.removeChildren(a);break}case x.CHANGED:{const a=e.children.find(h=>(h==null?void 0:h.props.key)===l.key),u=t.find(h=>h.props.key===l.key);v.removeComponentReferences(u),Object.assign(a.props,u.props),d.updateElement(a);break}case x.NONE:default:{const a=e.children.find(h=>h instanceof m&&h.props.key===l.key),u=t.find(h=>h instanceof m&&h.props.key===l.key);u&&v.removeComponentReferences(u),a&&u&&d.diffMergeChildren(a,u.children.filter(h=>h instanceof m))}break}}}catch(r){console.error("failed to diff merge children",e,t,r)}e.children=e.children.filter(r=>r!==null)}static svg(e){const t=document.createElementNS("http://www.w3.org/2000/svg",e.tag),{visible:s,...r}=e.props,o=Object.entries(_(r));for(const[l,a]of o){if(l.includes("bind:"))continue;const u=l==="className"?"class":l;t.setAttribute(u,a.toString())}for(const l of e.children)if(typeof l=="string"||typeof l=="number")t.append(l.toString());else if(typeof l=="function"){const a=l();typeof a=="string"||typeof a=="number"?t.append(a.toString()):t.append(d.svg(a))}else l&&t.append(d.svg(l));return t}static getMountLocation(e,t=0){if(!e.parent)return{element:null,idx:-1};for(let s=0;s<e.parent.children.length;s++){const r=e.parent.children[s];if(r===e)break;t+=d.getRenderedNodeCount(r)}return e.parent.element?{element:e.parent.element,idx:t+1}:d.getMountLocation(e.parent,t)}static getRenderedNodeCount(e){let t=0;if(e instanceof m){if(!e.props.visible)return 0;if(e.tag)return 1;for(const s of e.children)t+=d.getRenderedNodeCount(s);for(const s of e.funcComponents)t+=d.getRenderedNodeCount(s)}else(e instanceof N||typeof e=="string"||typeof e=="number")&&t++;return t}}const g=class g{constructor(){n(this,"serverComponentReferences",[]);n(this,"serverRequest",{path:"/",data:{}})}setServerRequestData(e){this.serverRequest=e}getServerRequestData(e){const t=e.split(".");let s={...this.serverRequest};for(let r=0;r<t.length;r++)if(s=s[t[r]],s===void 0)return;return s}static bake(e,t){const s=new m(t.tagName,{children:[e]});s.element=t,d.render(s)}static getComponentReferences(e){return g.isClient?g.componentReferences:e.cbInstance.serverComponentReferences}static removeComponentReferences(e){g.removeComponentChildReferences(e),g.isClient?g.componentReferences=g.componentReferences.filter(t=>t.component!==e):e.cbInstance.serverComponentReferences=e.cbInstance.serverComponentReferences.filter(t=>t.component!==e)}static removeComponentChildReferences(e){for(const t of e.children)t instanceof m&&g.removeComponentReferences(t)}static logComponentRefCount(e){console.debug("~~ CB REF COUNT",g.isClient?g.componentReferences.length:e.cbInstance.serverComponentReferences.length,performance.now())}static registerRuntimeServices(...e){g.runtimeServices.push(...e)}static getRuntimeService(e){return g.runtimeServices.find(t=>t instanceof e)}};n(g,"DEBUG_COMPONENT_REFCOUNT",!1),n(g,"isClient","window"in globalThis),n(g,"rootMap",new Map),n(g,"componentReferences",[]),n(g,"runtimeServices",[]),n(g,"addComponentReference",e=>{g.isClient?g.componentReferences.push(e):e.component.cbInstance.serverComponentReferences.push(e)});let v=g;class m{constructor(e,t={}){n(this,"parent",null);n(this,"children",[]);n(this,"funcComponents",[]);n(this,"element");n(this,"cbInstance");n(this,"isStatic",!1);n(this,"_mounted",!1);n(this,"subscription");n(this,"_props",{});this.tag=e,"visible"in t||(t.visible=!0),this.props=t}get mounted(){return this._mounted}set mounted(e){const t=this._mounted!==e;this._mounted=e,t&&e&&this._props.onMounted?setTimeout(()=>this._props.onMounted(this),0):t&&!e&&this._props.onUnmounted&&this._props.onUnmounted(this)}get props(){return this._props}set props(e){const{children:t,watch:s,...r}=e;if(Object.assign(this._props,r),t&&this.replaceChildren(t),v.isClient&&s){this._props.watch=s;const o="length"in s?s:[s];for(const l of o){const a=l.subscribe(this.applyBindProps.bind(this));v.addComponentReference({component:this,onDestroyed:()=>a()})}}}get childArgs(){return[]}applyBindProps(){var t;const e=Object.entries(this.props).filter(([s])=>s.startsWith("bind:"));for(const[s,r]of e){const o=s.substring(s.indexOf(":")+1),l=this.getPrimitive(r,()=>d.reRender(this)),a=this._props[o];this._props[o]=o==="children"&&l===!0?a:l,o==="visible"&&v.isClient?l!==a&&(l&&((t=this.parent)!=null&&t._props.visible)?d.reRender(this):d.unRender(this)):o==="children"?(this._props.children&&this.replaceChildren(this._props.children),v.isClient&&d.renderChildren(this)):this.element&&Object.assign(this.element,{[o]:this._props[o]})}}getPrimitive(e,t){return e instanceof N?(t&&this.subscribeTo((s,r)=>e.subscribe(t.bind(this))),e.value):typeof e=="function"?this.getPrimitive(e(this),t):e}subscribeTo(e){if(this.subscription)return;this.subscription=e;const t=r=>{this.props=Object.assign(this.props,r)},s=this.subscription(t,this);v.addComponentReference({component:this,onDestroyed:()=>s()})}removeChildren(...e){for(const t of e){const s=this.children.indexOf(t);t instanceof m&&(this.destroyComponentRefs(t),t.parent=null,d.unRender(t)),this.children[s]=null}}insertChildren(e,...t){this.children.splice(e,0,...t);for(const s of t)s instanceof m&&(s.parent=this,d.reRender(s))}appendChildren(...e){this.children.push(...e);for(const t of e)t instanceof m&&(t.parent=this,d.reRender(t))}prependChildren(...e){this.children.unshift(...e);for(const t of e)t instanceof m&&(t.parent=this,d.reRender(t))}replaceChild(e,t){d.unRender(e),this.destroyComponentRefs(e);const s=this.children.indexOf(e);this.children[s]=t,t.parent=this,d.reRender(t)}replaceChildren(e){this.destroyChildComponentRefs(this),this.children=e.map(t=>Array.isArray(t)?new G(t):t),this.linkChildren()}linkChildren(){for(let e=0;e<this.children.length;e++){const t=this.children[e];t instanceof m&&(t.parent=this,t.cbInstance=this.cbInstance,t.linkChildren())}}destroyChildComponentRefs(e){for(const t of e.children)typeof t=="string"||typeof t=="number"||typeof t!="function"&&t&&this.destroyComponentRefs(t)}shouldRender(){return this._props.visible?this.parent?this.parent.shouldRender():!0:!1}destroyComponentRefs(e){this.destroyChildComponentRefs(e);const t=v.getComponentReferences(e).filter(s=>s.component===e);for(;t.length;)t.pop().onDestroyed();v.removeComponentReferences(e)}onDestroy(){this.props.onDestroyed&&this.props.onDestroyed(this)}getParentOfType(e){if(this.parent)return this.parent instanceof e?this.parent:this.parent.getParentOfType(e)}unMount(){for(const e of this.children)e instanceof m&&e.unMount();this.mounted=!1}recursiveCall(e){e(this);for(const t of this.children)t instanceof m&&t.recursiveCall(e)}isSVG(){var e;try{return this.tag.toLowerCase()==="svg"||!!((e=this.element)!=null&&e.closest("svg"))}catch{return console.error("isSVG ERROR",this.element),!1}}}class G extends m{constructor(e=[]){super("",{children:e})}}const C=(i,e,...t)=>{if(typeof i=="function")return i({...e,children:t},t);let s=e||{};return s.children=t,new m(i,s)},ee=i=>{const e=()=>i.properties.map(a=>`${a.name}: ${a.from}`).join(";"),t=()=>i.properties.map(a=>`${a.name}: ${a.to}`).join(";"),s=Math.max(...i.properties.map(a=>a.ms??300)),r=a=>{!a.element||!v.isClient||a.element.setAttribute("style",`${l()};${t()}`)},o=a=>!a.element||!v.isClient?!1:(a.element.setAttribute("style",`${l()};${e()}`),new Promise(u=>{setTimeout(()=>i.cancelExit&&i.cancelExit()?(r(a),u(!1)):u(!0),s)})),l=()=>`transition: ${i.properties.map(a=>`${a.name} ${a.ms??300}ms`).join(",")}`;return{onMounted:r,onBeforeUnmounted:o,initialStyle:`${l()};${e()}`}},te=({tag:i="div",children:e,properties:t,cancelExit:s,...r})=>{const{onMounted:o,onBeforeUnmounted:l,initialStyle:a}=ee({properties:t,cancelExit:s});return new m(i,{children:e,style:a,onMounted:o,onBeforeUnmounted:l,...r})},ie=!1,c={screenWidth:640,screenHeight:480,sectionHeight:450,gravity:1.25,friction:.5,shopDistance:50,testMode:ie,testCoins:51};var M=(i=>(i[i.Rectangle=0]="Rectangle",i[i.Circle=1]="Circle",i))(M||{}),w=(i=>(i[i.Unset=0]="Unset",i[i.Player=1]="Player",i[i.Platform=2]="Platform",i[i.Item=3]="Item",i[i.Turret=4]="Turret",i[i.Projectile=5]="Projectile",i))(w||{}),y=(i=>(i[i.Unset=0]="Unset",i[i.Coin=1]="Coin",i[i.Portal=2]="Portal",i[i.AntiGravity=3]="AntiGravity",i[i.Shop=4]="Shop",i))(y||{}),E=(i=>(i[i.Unset=0]="Unset",i[i.Chill=1]="Chill",i[i.Stun=2]="Stun",i))(E||{});const z=class z{constructor(){n(this,"type",w.Unset);n(this,"pos",{x:0,y:0});n(this,"vel",{x:0,y:0});n(this,"speed",3);n(this,"maxSpeedX",12);n(this,"maxSpeedY",100);n(this,"jumpPower",20);n(this,"isJumping",!1);n(this,"hasJumpBoost",!1);n(this,"gravityMultiplier",1);n(this,"items",new N([]));n(this,"size",{width:0,height:0});n(this,"color","white");n(this,"glowColor","white");n(this,"glows",!1);n(this,"glowSize",10);n(this,"shape",M.Rectangle);n(this,"img",null);n(this,"isStatic",!0);n(this,"affectedByGravity",!1);n(this,"isCollidable",!0);n(this,"isColliding",!1);n(this,"canLeaveMap",!1);n(this,"deleted",!1)}get halfSize(){return{width:this.size.width/2,height:this.size.height/2}}draw(e,t=0){if(this.glows?(e.shadowBlur=this.glowSize,e.shadowColor=this.glowColor):e.shadowBlur=0,this.img){e.drawImage(this.img,this.pos.x-this.halfSize.width,this.pos.y-t-this.halfSize.height,this.size.width,this.size.height);return}e.fillStyle=this.color,e.beginPath(),this.shape===M.Circle?e.arc(this.pos.x,this.pos.y-t,this.halfSize.width,0,Math.PI*2):e.roundRect(this.pos.x-this.halfSize.width,this.pos.y-this.halfSize.height-t,this.size.width,this.size.height,3),e.fill(),e.closePath()}tick(){this.applyVelocity(),this.applyGravity(),this.applyFriction()}applyFriction(){this.isStatic||(this.vel.x>0?(this.vel.x-=c.friction*z.speedMultiplier,this.vel.x<0&&(this.vel.x=0)):this.vel.x<0&&(this.vel.x+=c.friction*z.speedMultiplier,this.vel.x>0&&(this.vel.x=0)))}applyGravity(){if(!(!this.affectedByGravity||this.isStatic)){if(this.pos.y+this.halfSize.height>=c.screenHeight){this.pos.y=c.screenHeight-this.halfSize.height,this.vel.y=0,this.isJumping=!1;return}this.vel.y+=c.gravity*this.gravityMultiplier*z.speedMultiplier}}applyVelocity(){this.isStatic||(this.vel.x>this.maxSpeedX&&(this.vel.x=this.maxSpeedX),this.vel.x<-this.maxSpeedX&&(this.vel.x=-this.maxSpeedX),this.vel.y>this.maxSpeedY&&(this.vel.y=this.maxSpeedY),this.vel.y<-this.maxSpeedY&&(this.vel.y=-this.maxSpeedY),this.pos.x+=this.vel.x*z.speedMultiplier,this.pos.y+=this.vel.y*z.speedMultiplier,this.canLeaveMap||(this.pos.x-this.halfSize.width<0&&(this.pos.x=this.halfSize.width,this.vel.x<0&&(this.vel.x=-this.vel.x*.5)),this.pos.x+this.halfSize.width>c.screenWidth&&(this.pos.x=c.screenWidth-this.halfSize.width,this.vel.x>0&&(this.vel.x=-this.vel.x*.5))))}handleCollisions(e){if(this.isCollidable&&!this.isStatic){this.isColliding=!1;for(const t of e)t!==this&&(t.isColliding=!1,t.isCollidable&&this.isCollidingWith(t)&&(this.isColliding=!0,t.isColliding=!0,this.handleCollision(t)))}}handleCollision(e){if(this.type===w.Player)switch(e.type){case w.Platform:this.handlePlatformCollision(e);break;case w.Item:e.interactWith(this);break;case w.Projectile:const s=e;s.deleted=!0,s.statusEffect&&this.statusEffects.add(s.statusEffect);break}}addItem(e){this.items.value.push(e),this.items.notify()}handlePlatformCollision(e){e.hasBehaviour(R.JumpBoost)&&(this.hasJumpBoost=!0);const t=this.pos.y+this.halfSize.height-this.vel.y,s=e.pos.y-e.halfSize.height,r=2;this.vel.y>=0&&t-r<=s&&(e.hasBehaviour(R.DestroyOnTouch)&&(e.deleted=!0),this.pos.y=e.pos.y-e.halfSize.height-this.halfSize.height+r,this.vel.y=0,this.isJumping=!1,e.hasBehaviour(R.MegaBounce)?this.vel.y=-(this.jumpPower*5):e.hasBehaviour(R.SuperBounce)?this.vel.y=-(this.jumpPower*1.5):e.hasBehaviour(R.Bounce)&&(this.vel.y=-(this.jumpPower*.75)))}isCollidingWith(e){return this.shape===M.Circle?e.shape===M.Circle?this.isCircleCollidingCircle(e):this.isCircleCollidingRectangle(e):e.shape===M.Circle?this.isCircleCollidingRectangle(e):this.isRectangleCollidingRectangle(e)}isCircleCollidingCircle(e){return Math.sqrt(Math.pow(e.pos.x-this.pos.x,2)+Math.pow(e.pos.y-this.pos.y,2))<this.halfSize.width+e.halfSize.width}isCircleCollidingRectangle(e){const t={x:Math.abs(this.pos.x-e.pos.x),y:Math.abs(this.pos.y-e.pos.y)};return t.x>e.halfSize.width+this.halfSize.width||t.y>e.halfSize.height+this.halfSize.height?!1:t.x<=e.halfSize.width||t.y<=e.halfSize.height?!0:Math.pow(t.x-e.halfSize.width,2)+Math.pow(t.y-e.halfSize.height,2)<=Math.pow(this.halfSize.width,2)}isRectangleCollidingRectangle(e){return this.pos.x+this.halfSize.width>e.pos.x-e.halfSize.width&&this.pos.x-this.halfSize.width<e.pos.x+e.halfSize.width&&this.pos.y+this.halfSize.height>e.pos.y-e.halfSize.height&&this.pos.y-this.halfSize.height<e.pos.y+e.halfSize.height}distanceTo(e){return Math.sqrt(Math.pow(e.pos.x-this.pos.x,2)+Math.pow(e.pos.y-this.pos.y,2))}angleTo(e){const t=e.pos.x-this.pos.x,s=e.pos.y-this.pos.y;return Math.atan2(s,t)}};n(z,"speedMultiplier",1);let b=z;var R=(i=>(i[i.Bounce=0]="Bounce",i[i.SuperBounce=1]="SuperBounce",i[i.MegaBounce=2]="MegaBounce",i[i.JumpBoost=3]="JumpBoost",i[i.MovesX=4]="MovesX",i[i.MovesY=5]="MovesY",i[i.DestroyOnTouch=6]="DestroyOnTouch",i))(R||{});class Y extends b{constructor({pos:t,size:s,behaviours:r=[]}){super();n(this,"behaviours",[]);n(this,"moveSpeed",Math.random()*2+1);n(this,"moveDirectionX",1);n(this,"moveDirectionY",1);n(this,"moveDistanceX",200);n(this,"moveDistanceY",100);n(this,"moveDistanceTravelledX",0);n(this,"moveDistanceTravelledY",0);this.type=w.Platform,this.pos=t,this.size=s,this.color="#66A",this.isStatic=!0,this.canLeaveMap=!0,this.behaviours=r,this.glows=!0,this.glowSize=3,this.glowColor="#000A",this.hasBehaviour(2)?(this.color="gold",this.glowColor="#FF0A"):this.hasBehaviour(1)?(this.color="#55F",this.glowColor="#228C"):this.hasBehaviour(6)&&(this.color="#66A8",this.glows=!1)}static randomPlatform(t,s={width:Math.random()*100+60,height:Math.random()*10+20},r=[]){return r.length>0?new Y({pos:t,size:s,behaviours:r}):(r.push(0),Math.random()>.95&&r.push(6),Math.random()>.95&&r.push(1),Math.random()>.99&&r.push(2),Math.random()>.5&&r.push(4),Math.random()>.5&&r.push(5),new Y({pos:t,size:s,behaviours:r}))}tick(){this.hasBehaviour(4)&&this.moveX(),this.hasBehaviour(5)&&this.moveY()}moveX(){this.vel.x=this.moveSpeed*this.moveDirectionX,this.pos.x+=this.vel.x*b.speedMultiplier,this.moveDistanceTravelledX+=this.moveSpeed,this.moveDistanceTravelledX>=this.moveDistanceX&&(this.moveDirectionX*=-1,this.moveDistanceTravelledX=0)}moveY(){this.vel.y=this.moveSpeed*this.moveDirectionY,this.pos.y+=this.vel.y*b.speedMultiplier,this.moveDistanceTravelledY+=this.moveSpeed,this.moveDistanceTravelledY>=this.moveDistanceY&&(this.moveDirectionY*=-1,this.moveDistanceTravelledY=0)}hasBehaviour(t){return this.behaviours.includes(t)}}class B extends b{constructor(t,s){super();n(this,"itemType",y.Unset);n(this,"isInteracting",!1);this.type=w.Item,this.pos=t,this.itemType=s,this.size={width:42,height:42},this.glowColor="#FF0",this.glows=!0,this.setImg()}setImg(){var t,s,r;switch(this.itemType){case y.Coin:this.img=((t=k.value.find(o=>o.name==="coin.png"))==null?void 0:t.image)||null,this.shape=M.Circle;break;case y.AntiGravity:this.img=((s=k.value.find(o=>o.name==="antigravity.png"))==null?void 0:s.image)||null;break;case y.Shop:this.img=((r=k.value.find(o=>o.name==="shop.png"))==null?void 0:r.image)||null,this.size={width:64,height:64},this.glows=!1;break}}tick(){if(this instanceof J&&this.otherPortal){if(this.isColliding||this.otherPortal.isColliding)return;this.isInteracting=!1,this.otherPortal.isInteracting=!1;return}this.itemType===y.Shop&&!this.isColliding&&H.value&&(H.value=!1)}interactWith(t){switch(this.itemType){case y.Portal:if(this instanceof J&&this.otherPortal){if(this.isInteracting||this.otherPortal.isInteracting)return;this.isInteracting=!0,this.otherPortal.isInteracting=!0,this.otherPortal.isColliding=!0,t.pos.x=this.otherPortal.pos.x,t.pos.y=this.otherPortal.pos.y,setTimeout(()=>{this instanceof J&&this.otherPortal&&(this.otherPortal.isColliding=!1)},100)}break;case y.Coin:t.addItem(this),this.deleted=!0;break;case y.AntiGravity:t.gravityMultiplier-=.5,setTimeout(()=>{t.gravityMultiplier+=.5},4e3),this.deleted=!0;break;case y.Shop:if(H.value)return;H.value=!0;break}}}const P=class P extends B{constructor(t,s){super(t,y.Portal);n(this,"otherPortal",null);this.idx=s,this.size.width=P.portalSize,this.size.height=P.portalSize,this.glowColor="#0FF",this.setImg()}static createPair(t){const s=P.portalSize,r=s+Math.random()*(c.screenWidth-s),o={x:r,y:Math.random()*500+100+t},a=Math.random()>.5?o.y-100-Math.random()*300:o.y+100+Math.random()*300,u={x:r>c.screenWidth/2?r-c.screenWidth/2:r+c.screenWidth/2,y:a},h=new P(o,0),p=new P(u,1);return h.otherPortal=p,p.otherPortal=h,[h,p]}setImg(){var t;this.img=((t=k.value.find(s=>s.name===`portal${this.idx===0?"2":""}.png`))==null?void 0:t.image)||null}};n(P,"portalSize",100);let J=P;class se extends B{constructor(e){super(e,y.Shop),this.size.width=64,this.size.height=64,this.glowColor="#FF0"}}class re{constructor(e,t){n(this,"type",E.Unset);n(this,"img",null);n(this,"duration",0);var s;switch(this.type=e,this.duration=t,e){case E.Chill:this.img=((s=k.value.find(r=>r.name==="thaw.png"))==null?void 0:s.image)||null;break}}tick(){this.duration-=1e3/60,this.duration<=0&&(this.type=E.Unset)}draw(e,t,s){this.img&&e.drawImage(this.img,t.x-s/2,t.y,s,s)}}class ne{constructor(){n(this,"effects",[])}draw(e,t,s,r){this.effects.forEach(o=>{o.draw(e,{x:t.x,y:t.y-r.height/2-s},r.width)})}has(e){return this.effects.some(t=>t.type===e)}add(e){this.effects=this.effects.filter(t=>t.type!==e.type),this.effects.push(e)}tick(){this.effects.forEach(e=>{e.tick()}),this.effects=this.effects.filter(e=>e.type!=E.Unset)}}class oe extends b{constructor(){super();n(this,"velocityParticles",[]);n(this,"abilities",[]);n(this,"coins",new N([]));n(this,"abilityJuiceCost",100);n(this,"abilityJuice",0);n(this,"maxAbilityJuice",300);n(this,"selectedAbilityIndex",-1);n(this,"defaultColor","#69c");n(this,"chilledColor","#8ac");n(this,"statusEffects",new ne);n(this,"inputs",{left:!1,right:!1,up:!1,down:!1});this.type=w.Player,this.size.width=50,this.size.height=50,this.pos.x=c.screenWidth/2,this.pos.y=c.screenHeight-this.halfSize.height,this.isStatic=!1,this.affectedByGravity=!0,this.color=this.defaultColor,this.glows=!0,this.glowColor="#000A",this.glowSize=3,this.attachKeybinds()}get isChilled(){return this.statusEffects.has(E.Chill)}get isStunned(){return this.statusEffects.has(E.Stun)}get numCoins(){return this.coins.value.length}get distanceFromGround(){return c.screenHeight-this.pos.y-this.halfSize.height}tick(){this.isColliding||(this.hasJumpBoost=!1),this.vel.y<0&&this.isJumping?this.size.width=Math.min(50,50-Math.abs(this.vel.y)/1.5):this.size.width=50,this.statusEffects.tick(),this.emitVelocityParticles(),this.handleInputs(),this.color=this.defaultColor,this.isChilled&&(this.color=this.chilledColor,this.vel.x*=.9,this.vel.y<0?this.vel.y*=.9:this.vel.y*=.95),this.isStunned&&(this.vel.x=0,this.vel.y=0),super.tick(),this.abilities.length>0&&this.vel.y<0&&(this.abilityJuice+=-this.vel.y/42,this.abilityJuice>this.maxAbilityJuice&&(this.abilityJuice=this.maxAbilityJuice))}addItem(t){switch(t.itemType){case y.Coin:this.coins.value.push(t),this.coins.notify();break;default:this.items.value.push(t),this.items.notify();break}}draw(t,s){this.drawVelocityParticles(t,s),super.draw(t,s),this.abilities.length>0&&(this.renderAbilityJuiceBar(t),this.renderAbilities(t)),this.statusEffects.draw(t,this.pos,s,this.size)}renderAbilityJuiceBar(t){const s="#a28c17aa",r="#d5bb30",l=this.maxAbilityJuice,a=c.screenWidth-10-10,u=c.screenHeight-l-10;t.shadowBlur=0,t.fillStyle=s,t.fillRect(a,u,10,l);const h=this.abilityJuice/this.maxAbilityJuice*l;t.fillStyle=r,t.fillRect(a,u+l-h,10,h);const p=2,S=Math.floor(l/this.abilityJuiceCost);t.fillStyle=s;for(let A=0;A<S;A++){const K=u+(A+1)*this.abilityJuiceCost;t.fillRect(a,K,10,p)}}renderAbilities(t){const o=c.screenWidth-50-10-30,l=c.screenHeight-50-10;this.abilities.forEach((a,u)=>{const h=u===this.selectedAbilityIndex;t.beginPath(),t.fillStyle=h?"#0004":"transparent",t.roundRect(o-u*50,l,50,50,5),t.fill(),t.strokeStyle=h?"#fff":"#0004",t.lineWidth=2,t.stroke(),t.closePath();const p=5;t.drawImage(a.img,o+p-u*50,l+p,50-p*2,50-p*2)})}drawVelocityParticles(t,s){this.velocityParticles.length!==0&&(t.shadowBlur=0,this.velocityParticles.forEach(r=>{t.fillStyle=r.color,t.fillRect(r.pos.x-r.size/2,r.pos.y-s,r.size,r.size)}))}emitVelocityParticles(){const s=Math.abs(this.vel.x),r=Math.abs(this.vel.y),o="#55F";if(s>5){const l={pos:{x:this.pos.x,y:this.pos.y},color:o,size:s/3};this.velocityParticles.push(l)}if(r>5){const l={pos:{x:this.pos.x,y:this.pos.y},color:o,size:r/3};this.velocityParticles.push(l)}this.velocityParticles.forEach(l=>{l.size*=.9}),this.velocityParticles=this.velocityParticles.filter(l=>l.size>.5)}handleInputs(){this.inputs.left&&(this.vel.x-=this.speed),this.inputs.right&&(this.vel.x+=this.speed),this.inputs.up&&!this.isJumping&&(this.vel.y>0&&(this.vel.y=0),this.vel.y-=this.jumpPower*(this.hasJumpBoost?2:1),this.isJumping=!0)}attachKeybinds(){window.addEventListener("keydown",t=>{switch(t.key.toLowerCase()){case"arrowleft":case"a":this.inputs.left=!0;break;case"arrowright":case"d":this.inputs.right=!0;break;case"arrowup":case"w":this.inputs.up=!0;break;case"arrowdown":case"s":this.inputs.down=!0;break}}),window.addEventListener("wheel",t=>{this.abilities.length>1&&(t.deltaY>0?(this.selectedAbilityIndex++,this.selectedAbilityIndex>=this.abilities.length&&(this.selectedAbilityIndex=0)):(this.selectedAbilityIndex--,this.selectedAbilityIndex<0&&(this.selectedAbilityIndex=this.abilities.length-1)))}),window.addEventListener("keypress",t=>{var s;switch(t.key.toLowerCase()){case" ":this.abilities.length>0&&this.abilityJuice>=this.abilityJuiceCost&&((s=this.abilities[this.selectedAbilityIndex])==null||s.use(this),this.abilityJuice-=this.abilityJuiceCost);break}}),window.addEventListener("keyup",t=>{switch(t.key.toLowerCase()){case"arrowleft":case"a":this.inputs.left=!1;break;case"arrowright":case"d":this.inputs.right=!1;break;case"arrowup":case"w":this.inputs.up=!1;break;case"arrowdown":case"s":this.inputs.down=!1;break}})}}class he{constructor(e){n(this,"maxDistance",c.screenHeight/2);n(this,"offsetY",0);n(this,"targetY",0);this.player=e}tick(){this.targetY=this.player.pos.y,this.targetY>c.screenHeight/2&&(this.targetY=c.screenHeight/2),this.lerpToTarget()}lerpToTarget(){const t=this.targetY-c.screenHeight/2-this.offsetY;this.offsetY+=t*.15}draw(e){e.fillStyle="red";const t=this.player.pos.y;e.fillRect(c.screenWidth/2-2,t-this.offsetY-2,4,4)}}class le extends b{constructor(t,s,r,o){super();n(this,"maxSpeedX",30);n(this,"maxSpeedY",30);n(this,"gravityMultiplier",.5);this.pos=t,this.vel=s,this.statusEffect=o,this.type=w.Projectile,this.pos=t,this.vel=s,this.isCollidable=!0,this.isStatic=!1,this.shape=M.Circle,this.size={width:r*2,height:r*2},this.affectedByGravity=!0}tick(){super.tick()}}class ae extends b{constructor(t,s,r){super();n(this,"shootRange",c.screenWidth);n(this,"shootCooldown",1e3);n(this,"lastShot",0);this.pos=t,this.player=s,this.addProj=r,this.type=w.Turret,this.shape=M.Circle,this.size={width:50,height:50},this.isCollidable=!1,this.isStatic=!0,this.color="#F00A"}tick(){if(this.distanceTo(this.player)>this.shootRange){this.lastShot=0;return}this.lastShot+=1e3/60,this.lastShot>=this.shootCooldown&&(this.shoot(),this.lastShot=0)}shoot(){const t=this.angleTo(this.player),s={x:Math.cos(t)*30,y:Math.sin(t)*30},r=new le({x:this.pos.x,y:this.pos.y},s,10,new re(E.Chill,1e3));r.color="#F00",this.addProj(r)}}class ce{constructor(){n(this,"camera");n(this,"score",0);n(this,"player");n(this,"platforms",[]);n(this,"turrets",[]);n(this,"projectiles",[]);n(this,"items",[]);n(this,"maxSection");n(this,"isGameOver",!1);n(this,"currentShop",null);n(this,"directionIndicator",null);n(this,"directionIndicatorIcon",null);n(this,"speedMultiplier",1);this.player=new oe,this.platforms=[new Y({size:{width:250,height:20},pos:{x:200,y:c.screenHeight-120},behaviours:[R.Bounce,R.MovesX]})],this.items=[],this.camera=new he(this.player),this.maxSection=1,this.generateNextSection()}set section(e){e<=this.maxSection||(this.maxSection=e,this.generateNextSection())}removeItem(e){this.items.splice(this.items.indexOf(e),1)}tick(){this.handleCollisions();for(const e of this.platforms)e.tick();this.platforms=this.platforms.filter(e=>!e.deleted);for(const e of this.items)e.tick();this.items=this.items.filter(e=>!e.deleted);for(const e of this.turrets)e.tick();this.turrets=this.turrets.filter(e=>!e.deleted);for(const e of this.projectiles)e.tick();if(this.projectiles=this.projectiles.filter(e=>!e.deleted),this.player.tick(),this.camera.tick(),this.score=0,this.score=Math.floor(Math.abs(this.player.pos.y-c.screenHeight+this.player.halfSize.height)/50),this.section=Math.abs(Math.floor(this.player.pos.y/c.sectionHeight))+1,this.currentShop){const e=Math.abs(this.currentShop.pos.y-this.camera.offsetY-c.screenHeight/2);if(e>c.screenHeight/2&&e<c.screenHeight*3){const t=this.currentShop.pos.x-this.currentShop.halfSize.width,s=this.camera.offsetY>this.currentShop.pos.y?0:c.screenHeight;this.directionIndicator={x:t,y:s},this.directionIndicatorIcon=this.currentShop.img}else this.directionIndicator=null,this.directionIndicatorIcon=null}else this.directionIndicator=null,this.directionIndicatorIcon=null}generateNextSection(){const e=[],s=c.screenWidth/3;let r=!1;for(let o=0;o<3;o++){const l=!r&&this.maxSection%c.shopDistance===0,a=100,u=Math.random()*(o+1)*s,h=l?c.sectionHeight-this.maxSection*c.sectionHeight:c.sectionHeight-this.maxSection*c.sectionHeight+Math.random()*a-a/2;if(l){this.currentShop&&this.items.splice(this.items.indexOf(this.currentShop),1);let p=Math.random()*c.screenWidth;this.currentShop=new se({x:p,y:h-48}),this.items.push(this.currentShop),r=!0,e.push(Y.randomPlatform({x:p,y:h},{height:30,width:160},[R.JumpBoost]));break}Math.random()>.66&&(this.items.push(new B({x:u,y:h-c.sectionHeight/2},y.Coin)),Math.random()>.66&&(this.items.push(new B({x:u,y:h-c.sectionHeight/2-64},y.Coin)),Math.random()>.66&&this.items.push(new B({x:u,y:h-c.sectionHeight/2-128},y.Coin)))),e.push(Y.randomPlatform({x:u,y:h}))}if(this.maxSection%4===0&&this.maxSection>60&&Math.random()>.9){const o=-(this.maxSection+1)*c.sectionHeight;this.items.push(...J.createPair(o))}if(this.maxSection%8===0&&Math.random()>.8){const o=c.sectionHeight-(this.maxSection+1)*c.sectionHeight;this.items.push(new B({x:c.screenWidth/2,y:o},y.AntiGravity))}if(this.maxSection%3===0&&this.maxSection>5&&Math.random()>.3){const o=c.sectionHeight-(this.maxSection+1)*c.sectionHeight;this.turrets.push(new ae({x:Math.random()>.5?0:c.screenWidth,y:o},this.player,this.addProjectile.bind(this)))}this.platforms.push(...e)}addProjectile(e){this.projectiles.push(e)}handleCollisions(){this.player.handleCollisions([...this.platforms,...this.items,...this.projectiles])}onShopContinueClick(){this.player.vel.y-=50}onShopAbilityClick(e){this.player.abilities.push(e),this.player.selectedAbilityIndex===-1&&(this.player.selectedAbilityIndex=0),I.value=I.value.filter(t=>t!==e),this.player.coins.value.splice(0,e.price),this.player.coins.notify()}}const W=D({});W.subscribe(i=>{i.canvas&&(i.canvas.width=c.screenWidth,i.canvas.height=c.screenHeight,i.ctx=i.canvas.getContext("2d")),i.bgCanvas&&(i.bgCanvas.width=c.screenWidth,i.bgCanvas.height=c.screenHeight,i.bgCtx=i.bgCanvas.getContext("2d"))});let f;const de=()=>{f=new ce},H=D(!1),I=D([]),k=D([]),O=D(null),q=D(0),X=[{image:"space.png",speed:.166},{image:"coin.png",speed:.166},{image:"portal.png",speed:0},{image:"portal2.png",speed:0},{image:"antigravity.png",speed:0},{image:"shop.png",speed:0},{image:"snail.png",speed:0},{image:"boot.png",speed:0},{image:"thaw.png",speed:0}];let L=0;const ue=i=>{X.forEach(e=>{const t=new Image;t.src=`../img/${e.image}`,t.onload=()=>{L++,L===X.length&&i()},k.value.push({image:t,speed:e.speed,name:e.image})})};var T=(i=>(i.SlowMo="SlowMo",i.DoubleJump="DoubleJump",i))(T||{});class V{constructor(e,t=50){n(this,"img");switch(this.type=e,this.price=t,e){case"SlowMo":this.img=k.value.find(s=>s.name==="snail.png").image;break;case"DoubleJump":this.img=k.value.find(s=>s.name==="boot.png").image;break}if(!this.img)throw new Error("No image found for ability "+e)}use(e){switch(this.type){case"SlowMo":b.speedMultiplier*=.5,setTimeout(()=>{b.speedMultiplier*=2},6e3);break;case"DoubleJump":e.vel.y-=e.jumpPower*2;break}}render(e,t,s){e.drawImage(this.img,t.x-s/2,t.y-s/2,s,s)}}const fe=()=>{let i,e;const t=()=>{i&&e&&(W.value={canvas:i,bgCanvas:e},ue(()=>{const s=k.value.find(r=>r.name==="space.png");if(!s)throw new Error("Background image not loaded");O.value=s.image,q.value=s.speed,ge()}))};return C("div",{style:{width:c.screenWidth+"px",height:c.screenHeight+"px",position:"relative"}},C("canvas",{id:"bg-canvas",onMounted:s=>{e=s.element,t()}}),C("canvas",{onMounted:s=>{i=s.element,t()}}),C(te,{properties:[{name:"opacity",from:"0",to:"1"}],id:"shop-ui",watch:H,"bind:visible":()=>H.value,cancelExit:()=>H.value},C("h1",null,"Shop"),C("div",{className:"shop-inventory",watch:I,"bind:children":!0},()=>I.value.length>0?I.value.map(s=>C(pe,{ability:s})):C("i",null,"All abilities purchased"))))},pe=({ability:i})=>{const e=f.player;return C("button",{className:"shop-ability",onclick:()=>f.onShopAbilityClick(i),watch:e.coins,"bind:disabled":()=>e.numCoins<i.price,"bind:title":()=>e.numCoins>=i.price?"":"Not enough coins"},C("span",{className:"shop-ability-title"},i.type),C("img",{src:i.img.src}),C("small",{className:"shop-ability-price"},i.price))};let U=null;function ge(){if(!O.value)throw new Error("Background image not loaded");let i=W.value.ctx,e=W.value.bgCtx;if(!i)throw new Error("Context not loaded");if(!e)throw new Error("Background context not loaded");I.value=[new V(T.SlowMo),new V(T.DoubleJump)],U=e.createPattern(O.value,"repeat"),e.fillStyle=U,e.fillRect(0,-c.screenHeight*999,c.screenWidth,c.screenHeight*1e3),de(),window.setInterval(()=>{me()},1e3/60)}let $=0;function F(i){return i.pos.y+i.size.height>f.camera.offsetY-c.screenHeight&&i.pos.y+i.size.height<f.camera.offsetY+c.screenHeight*2}function me(){let i=W.value.ctx,e=W.value.bgCtx;if(!f||!i||!e)return;i.clearRect(0,0,c.screenWidth,c.screenHeight),f.tick();for(const r of f.platforms)F(r)&&r.draw(i,f.camera.offsetY);for(const r of f.items)F(r)&&r.draw(i,f.camera.offsetY);for(const r of f.turrets)F(r)&&r.draw(i,f.camera.offsetY);for(const r of f.projectiles)F(r)&&r.draw(i,f.camera.offsetY);if(f.player.draw(i,f.camera.offsetY),f.directionIndicator&&f.directionIndicatorIcon){const r=f.directionIndicator.x,o=f.directionIndicator.y;i.drawImage(f.directionIndicatorIcon,r,o,50,50)}const t=-f.camera.offsetY-$;$=-f.camera.offsetY;const s=Math.round(t*q.value);e.translate(0,s),e.fillRect(0,-c.screenHeight*999,c.screenWidth,c.screenHeight*1e3),i.fillStyle="white",i.font="13px monospace",i.fillText(`Height: ${f.score}`,10,20),i.fillText(`Coins: ${f.player.numCoins}`,10,40)}const ye=document.getElementById("app");v.bake(fe(),ye);
