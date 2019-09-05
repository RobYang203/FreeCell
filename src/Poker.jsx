import React from "react"
export default class Board extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			pokers:[null,null,null,null,null,null,null,null],
			showDragPkNumberList:null
		}; 
		this.isRollBack = false;
		this.sfPokerList = this.shufflePoker();
		this.transferData = {
			sourceArea:{
				index:null,
				rect:null
			},
			targetArea:{
				index:null,
				rect:null
			},
			moveInfoList:[],
			state:"",
			allowCount: 5
		};
		this.recordList = [];
		
		this.createPokerList = this.createPokerList.bind(this);
		this.getRandom = this.getRandom.bind(this);
		this.shufflePoker = this.shufflePoker.bind(this);
		this.onLicensing = this.onLicensing.bind(this);

		this.createSetPokerAreaList = this.createSetPokerAreaList.bind(this);
		this.createSetCompilationAreaList = this.createSetCompilationAreaList.bind(this);
		this.createSetTemporaryAreaList = this.createSetTemporaryAreaList.bind(this);

		this.setMovingDragImage = this.setMovingDragImage.bind(this);
		this.transferCenter = this.transferCenter.bind(this);
		this.rollBack = this.rollBack.bind(this);
		console.log(this.sfPokerList);
	}
	render(){
		const setPokerAreaList = this.createSetPokerAreaList();
		const setTemporaryAreaList = this.createSetTemporaryAreaList();
		const setCompilationAreaList = this.createSetCompilationAreaList();
		return(
			<div>
				<div className="topArea">
					<div className="temporaryArea">
						{setTemporaryAreaList}
					</div>
					<div className="compilationArea">
						{setCompilationAreaList}
					</div>
				</div>
				<div className="bottomArea">
					<div className="freeCellArea">
						{setPokerAreaList}
					</div>
					<div className="toolArea">
						<div className="icon icon-cw" onClick={(e)=>{this.rollBack(e)}}></div>
					</div>
				</div>
				
				<SetPokersArea areaIndex={-1} areaType="freeCell" poker={this.state.showDragPkNumberList} isShowArea={true}/>

			</div>
			);
	}
	componentDidMount(){
		this.onLicensing();
		/*
		for(let i =0; i < 8 ; i++){
			const tmp = i+1;
			const number = this.getPokerNumber(tmp);
			const suit = this.getPokerSuit(tmp)
			const poker = <Poker number={number} suit={suit} />
			const _that = this;
			setTimeout(function(){
				_that.setState({
					poker:poker
				});
			},tmp * 500);
			
		}*/
	}



	//建立放置撲克牌區域
	createSetPokerAreaList(){
		const ret = []; 
		for(let i =0; i < 8 ; i++){
			const tmp = <SetPokersArea areaIndex={i} poker={this.state.pokers[i]}
							transferCenter={this.transferCenter}
							areaType="freeCell"
						/>;		
			ret.push(tmp);	
		}
		return ret;
	}
	//建立暫存區
	createSetTemporaryAreaList(){
		const ret = []; 
		for(let i =11; i <= 14 ; i++){
			const tmpPoker ={
				notify:null,
				pkNumberList:[]
			}
			const tmp = <SetPokersArea 
							areaIndex={i} 
							poker={this.state.pokers[i]}
							transferCenter={this.transferCenter}
							areaType="temporary"
						/>;		
			ret.push(tmp);	
		}
		return ret;
	}
	//建立歸類區
	createSetCompilationAreaList(){
		const ret = []; 
		for(let i =21; i <= 24 ; i++){
			const tmpPoker ={
				notify:null,
				pkNumberList:[]
			}
			const tmp = <SetPokersArea 
							areaIndex={i} 
							poker={this.state.pokers[i]}
							transferCenter={this.transferCenter}
							areaType="compilation"
						/>;		
			ret.push(tmp);	
		}
		return ret;
	}

	//建立撲克牌陣列 1 - 52
	createPokerList(){
		const ret = [];
		for(let i = 0 ; i < 52 ; i++){
			ret.push(i+1);
		}
		return ret;
	}



	//洗牌
	shufflePoker(){
		const pokerList = this.createPokerList();
		const ret = [];
		do{
			const max = pokerList.length-1;
			const i = this.getRandom(max);
			ret.push(pokerList[i]);
			pokerList.splice(i,1);
		}while(pokerList.length > 1);
		ret.push(pokerList[0]);
		return ret;
	}

	getRandom(max){
    	return Math.floor(Math.random()*max);
	}
	// 發牌回應 ，對每區每次發一張，發到牌沒有
	onLicensing(){
		const pkNumberList = this.state.pokers;
		this.sfPokerList.map((pkNumber,i)=>{
				const pkIndex = i % 8;
				if(pkNumberList[pkIndex] === null){
					pkNumberList[pkIndex] = {
						notify:null,
						pkNumberList:[]
					};
				}
				pkNumberList[pkIndex]["pkNumberList"].push(pkNumber);
		});
		for(let i =11; i <= 14 ; i++){
			const tmpPoker ={
				notify:null,
				pkNumberList:[]
			}
			pkNumberList[i] = tmpPoker;
		}
		for(let i =21; i <= 24 ; i++){
			const tmpPoker ={
				notify:null,
				pkNumberList:[]
			}
			pkNumberList[i] = tmpPoker;
		}
		console.log(pkNumberList);
		this.setState({pokers:pkNumberList});
		
	}
	setMovingDragImage(moveInfoList){
		const list = [];
		moveInfoList.map((pkInfo ,i)=>{
			list.push(pkInfo.pkNumber);
		});
		const tmp = {
			notify:null,
			pkNumberList:list
		}
		this.setState({
			showDragPkNumberList:tmp
		});
	}
	transferCenter(area , requestCode, values){
		const pokers = this.state.pokers;
		const recordInfo = this.recordList[this.recordList.length-1];		
		switch(requestCode){
			case "allowCount":
				this.transferData.allowCount = this.transferData.allowCount + values;
				console.log("allowCount" + " " +  this.transferData.allowCount);
				break;
			case "waitTrans":
				this.transferData["sourceArea"]  = area;
				this.transferData["moveInfoList"] = values;
				this.transferData["state"] = requestCode;
				//this.state.pokers[areaIndex].state= "dragging";
				this.setMovingDragImage(values);
				break;
			case "arrival":
				this.transferData["targetArea"]  = area;
				return this.transferData;
				break;
			case "reject":
				this.transferData["state"] = requestCode;
				break;
			case "accept":
				this.transferData["state"] = requestCode;
				this.recordList.push(Object.assign({},this.transferData));
				break;
			case "finish":
				//this.state.pokers[areaIndex].state= null;
				console.log("finish" + " " +  this.transferData.allowCount);
				return this.transferData;
				break;
			case "done":				
				this.transferData["moveInfoList"] = [];
				this.transferData["state"] = requestCode;
				break;
			case "rollBack":
			  	return this.recordList[this.recordList.length-1];
				break;
			case "rollBackNext":
				const rbSourceIndex = recordInfo["sourceArea"].index;
				pokers[rbSourceIndex].notify ="insertCard";
				pokers[area.index].notify =null;					
			  	this.setState({pokers:pokers});
				break;
			case "rollBackDone":
				pokers[area.index].notify =null;
				const recordLen = this.recordList.length -1;
				this.transferData.allowCount =  this.recordList[recordLen].allowCount;
				this.recordList.splice(recordLen,1);
				this.setState({pokers:pokers});
				this.isRollBack = false;
				break;
		}

	}
	rollBack(e){
		if(this.recordList.length === 0 || this.isRollBack)
			return;
		//取最後一筆
		this.isRollBack = true;
		const rbRecord = this.recordList[this.recordList.length-1];
		const targetIndex = rbRecord["targetArea"].index;
		const sourceIndex = rbRecord["sourceArea"].index;
		const pokers = this.state.pokers;
		pokers[targetIndex].notify = "deleteCard";
		this.setState({pokers:pokers});
		//rbRecord

	}

}




class SetPokersArea extends React.Component{
	constructor(props){
		super(props);
		//areaState licensing 、normal 、 dragging 、refresh
		this.state = {areaState:"licensing"}
		this.isNoCard = false;
		this.pokerList = [];
		/*
			const pkInfo={
				pkNumber:pkNumber,
				number:0,
				state:"refresh",//refresh 、 dragging 、 movinglock 、 deleteCard 、inertCard
				suit:null,
				color:null,
				interlockIndex:null
			};
		*/
		this.areaStyle= null;
		this.areaType =this.props.areaType;
		this.areaIndex = this.props.areaIndex;
		this.pkInfoList={};
		this.pkNumberList=[];
		this.recordList = null;

		const isShowArea = this.props.isShowArea;
		this.showAreaClass = `setPokersArea ${isShowArea?"showDragImage":""}`;

		this.onPokerDragEnter = this.onPokerDragEnter.bind(this);
		this.onPokerDragOver = this.onPokerDragOver.bind(this);
		this.onPokerDragLeave = this.onPokerDragLeave.bind(this);
		this.onPokerDrop = this.onPokerDrop.bind(this);

		this.onPokerDragStart = this.onPokerDragStart.bind(this);
		this.onPokerDrag = this.onPokerDrag.bind(this);
		this.onPokerDragEnd = this.onPokerDragEnd.bind(this);

		this.pkConvertToNumber = this.pkConvertToNumber.bind(this);
		this.getPokerNumber = this.getPokerNumber.bind(this);
		this.getPokerSuit = this.getPokerSuit.bind(this);
		this.createPokerCard = this.createPokerCard.bind(this);
		this.setPkInfo  =this.setPkInfo.bind(this);
		this.getDropResultCode = this.getDropResultCode.bind(this);
		this.rollBackCallBack = this.rollBackCallBack.bind(this);
	}
	componentWillUpdate(nextProps, nextState){
		if(nextProps.poker === null)
			return
		let areaState = nextState.areaState;//nextProps.poker.state === null? nextState.areaState : nextProps.poker.state;
		if(areaState === "licensing" || this.props.isShowArea){
			this.pkNumberList = nextProps.poker.pkNumberList;			
			areaState = "refresh";
		}

		if(areaState === "refresh" || this.props.isShowArea){
			this.pkInfoList = this.setPkInfo(this.pkNumberList);
		}

		const parentNotify =  nextProps.poker.notify;
		if(parentNotify !== null){
			areaState = "refresh";
			const area = {
				index:this.areaIndex,
				react:null
			};
			const transferData = this.props.transferCenter(area , "rollBack", null);
			this.recordList =Object.assign([],transferData["moveInfoList"]) ;
			switch(parentNotify){
				case "deleteCard":
					this.pkInfoList.map((pkInfo ,i)=>{
						this.recordList.map((rbRecord)=>{
							if(rbRecord.pkNumber === pkInfo.pkNumber){
								pkInfo.state = parentNotify;
							}

						});
					});
					break;
				case "insertCard":
					this.recordList.map((rbRecord)=>{		
						rbRecord.state = parentNotify;					
						this.pkInfoList.push(rbRecord);
					});
					break;
			}
		}

		if(areaState === "refresh" || areaState === "dragging" || areaState === "dragIn" || this.props.isShowArea){
			
			//areaState = "normal";
			this.pokerList = [];
			if(!this.props.isShowArea){
				const emptyState = areaState === "dragIn"? areaState: "empty";
				const emptyPoker = this.createEmptyPokerCard(emptyState);
				this.pokerList.push(emptyPoker);
			}
			
			
			const pkLen = this.pkInfoList.length;
			let areaH = 222;
			this.pkInfoList.map((pkInfo,i)=>{	
				if(this.areaType === "freeCell")	
					areaH += 45;
				const tmp = this.createPokerCard( pkInfo, i, pkLen-1);
				if(tmp !== null)
					this.pokerList.push(tmp);
			});

			areaH = this.props.isShowArea?areaH*2:areaH;

			this.areaStyle={
				height:areaH+"px"
			};
		}

		if(areaState === "normal")
			return false;
		
	}

	render(){
		return(
			<div className={this.showAreaClass} 
				style={this.areaStyle}
				>
				{this.pokerList}				
			</div>
			
			);
	}
	componentDidUpdate(prevProps, prevState, snapshot){
		if(this.state.areaState === "licensing" || this.state.areaState  === "refresh")
			this.setState({areaState:"normal"});
		if(this.props.notify === "deleteCard" || this.props.notify === "insertCard"){

			this.props.transferCenter(area , "rollBack", values);
		}
			
	}

	onPokerDragEnter(e, index){
		e.preventDefault();
		console.log("onDragEnter "+ index);
		console.log(e);
		if(index === 99999999){
			this.setState({areaState:"dragIn"});
		}
		
		if(this.props.onDragEnter === null || this.props.onDragEnter === undefined)
			return;
		this.props.onDragEnter(e);

	}
	onPokerDragOver(e, index){
		e.preventDefault();
		
		if(this.props.onDragOver === null || this.props.onDragOver === undefined)
			return;
		this.props.onDragOver(e);

	}
	onPokerDragLeave(e, index){
		console.log("onDragLeave"+ index);
		console.log(e);
		if(index === 99999999){
			this.setState({areaState:"refresh"});
		}

		if(this.props.onDragLeave === null || this.props.onDragLeave === undefined)
			return;
		this.props.onDragLeave(e);
	}
	onPokerDrop(e, index){
		console.log("onPokerDrop"+ index);
		console.log(e);
		const emptyInfo={
				pkNumber:"empty",
				number:0,
				state:"refresh",
				suit:"empty",
				color:"empty",
				interlockIndex:null
			};
		const targetInfo = this.pkInfoList[index] === undefined || this.pkInfoList[index] === null? emptyInfo: this.pkInfoList[index];
		const rect = e.target.getBoundingClientRect();
		const area = {
			index :this.areaIndex,
			rect: rect
		};
		const transferData = this.props.transferCenter(area, "arrival");
		
		
		
		//const colorPair = targetInfo.color !== sourceInfoList[0].color;
		//const numberPair = this.pkConvertToNumber(targetInfo.number)-1 === this.pkConvertToNumber(sourceInfoList[0].number);
		
		let returnCode = this.getDropResultCode( targetInfo, transferData);
		this.props.transferCenter(area, returnCode);
		if(returnCode === "accept"){
			const beforeIsNoCard = this.pkNumberList.length === 0;
			transferData.moveInfoList.map((pkInfo , i)=>{
				this.pkNumberList.push(pkInfo.pkNumber);
			});		
			const isNoCard =  this.pkNumberList.length === 0;
			const isEmptyChange = isNoCard !== beforeIsNoCard;
			const notCompilation = this.areaType !== "compilation";

			if(!isNoCard && notCompilation && isEmptyChange)	{
				this.props.transferCenter(null , "allowCount", -1);
			}
		}
		this.setState({areaState:"refresh"});
		


		if(this.props.onPokerDrop === null || this.props.onPokerDrop === undefined)
			return;
		this.props.onPokerDrop(e);
	}


	onPokerDragStart(e, index){
		console.log("onDragStart"+ index);
		console.log(e);

		const dragPoker = this.pkInfoList[index];		
		dragPoker.state = "dragging";
		
		const moveInfoList = [dragPoker];
		if(dragPoker.interlockIndex !== -1){
			let iLPKInfo = this.pkInfoList[dragPoker.interlockIndex];
			do{
				iLPKInfo.state ="movingLock";
				moveInfoList.push(iLPKInfo);

				const nextInterlockIndex = iLPKInfo.interlockIndex;
				iLPKInfo = this.pkInfoList[nextInterlockIndex];
			}while(iLPKInfo !== null && iLPKInfo !== undefined);						
		}

		const rect = e.target.getBoundingClientRect();
		const area = {
			index :this.areaIndex,
			rect: rect
		};
		this.setState({areaState:"dragging"});
		this.props.transferCenter(area, "waitTrans",moveInfoList);

		const x = e.nativeEvent.layerX;
		const y = e.nativeEvent.layerY;
		e.dataTransfer.setDragImage(document.querySelector(".setPokersArea.showDragImage"), x, y);		
	}
	onPokerDragEnd(e, index){
		console.log("onDragEnd"+ index);
		console.log(e);

		const transferData = this.props.transferCenter(this.areaIndex, "finish");

		if(transferData.state === "accept"){
			const removeLen = transferData.moveInfoList.length;
			const removeIndex = this.pkNumberList.length - removeLen ;

			const beforeIsNoCard = this.pkNumberList.length === 0;

			this.pkNumberList.splice(removeIndex,removeLen);

			const isNoCard =  this.pkNumberList.length === 0;
			const isEmptyChange = isNoCard !== beforeIsNoCard;
			const notCompilation = this.areaType !== "compilation";

			
			if(isNoCard && notCompilation && isEmptyChange)	{
				this.props.transferCenter(null , "allowCount", 1);
			
			}
			
			console.log("transferData.allowCount " + transferData.allowCount );
		}
		this.props.transferCenter(null , "done", null);
		this.setState({areaState:"refresh"});
	}
	onPokerDrag(e, index){

		this.pkInfoList[index].state = "dragging";

	}

	//建立撲克牌實體
	createPokerCard(pkInfo ,index ,lastIndex){
		const { number, suit, interlockIndex, state} = pkInfo;


		const isDraggable = interlockIndex !== null ;//|| this.areaType !== "compilation";
		const spacing = this.areaType === "freeCell"? 45 : 0;

		let onPokerDragEnter = null;
		let onPokerDragOver = null;
		let onPokerDragLeave = null;
		let onPokerDrop = null;

		if(lastIndex === index && state !== "dragging"){

			onPokerDragEnter = this.onPokerDragEnter;
			onPokerDragOver = this.onPokerDragOver;
			onPokerDragLeave = this.onPokerDragLeave;
			onPokerDrop = this.onPokerDrop;
		}
		const poker = 
			<PokerHolder index={index}
				spacing={spacing}
				Draggable={isDraggable}
				state={state}
				onPokerDragStart={this.onPokerDragStart}
				onPokerDrag={this.onPokerDrag}
				onPokerDragEnd={this.onPokerDragEnd}

				onPokerDragEnter={onPokerDragEnter}
				onPokerDragOver={onPokerDragOver}
				onPokerDragLeave={onPokerDragLeave}
				onPokerDrop={onPokerDrop}
				>
				<Poker number={number} state={state} suit={suit} rollBackCallBack={this.rollBackCallBack}/>
			</PokerHolder>			
		return poker;
	}
	createEmptyPokerCard(type){
		const state = type;

		let onPokerDragEnter = null;
		let onPokerDragOver = null;
		let onPokerDragLeave = null;
		let onPokerDrop = null;

		if(this.pkNumberList.length === 0){

			onPokerDragEnter = this.onPokerDragEnter;
			onPokerDragOver = this.onPokerDragOver;
			onPokerDragLeave = this.onPokerDragLeave;
			onPokerDrop = this.onPokerDrop;
		}
		
		const poker = 
			<PokerHolder index={99999999}
				spacing={0}
				Draggable={false}
				state={state}
				onPokerDragStart={null}
				onPokerDrag={null}
				onPokerDragEnd={null}

				onPokerDragEnter={onPokerDragEnter}
				onPokerDragOver={onPokerDragOver}
				onPokerDragLeave={onPokerDragLeave}
				onPokerDrop={onPokerDrop}
				>
			</PokerHolder>			
		return poker;

	}
	//取得目前數字
	getPokerNumber(i){
		const index = i%13;
		let ret = "";
		switch(index){
			case 1:
				ret = "A";
				break;
			case 11:
				ret = "J";
				break;
			case 12:
				ret = "Q";
				break;
			case 0:
				ret = "K";
				break;
			default:
				ret = index.toString();
				break;	
		}
		return ret;
	}

	//取得目前撲克花色
	getPokerSuit(i){
		const index = Math.ceil(i/13);
		let ret = "";
		switch(index){
			case 1:
				ret = "spade";
				break;
			case 2:
				ret = "heart";
				break;
			case 3:
				ret = "diamond";
				break;
			case 4:
				ret = "club";
				break;
		}
		return ret;
	}
	pkConvertToNumber(v){
		let ret = 0;
		switch(v){
			case "A":
				ret = 1;
				break;
			case "J":
				ret = 11;
				break;
			case "Q":
				ret = 12;
				break;
			case "K":
				ret = 13;
				break;
			default:
				ret = Number(v);
				break;	
		}
		return ret;

	}
	setPkInfo(numberList){
		const ret = [];
		const len = numberList.length;
		for(let i=len; i >0; i--){
			const index = i-1;
			const pkNumber = numberList[index];
			const pkInfo={
				pkNumber:pkNumber,
				number:0,
				state:"refresh",
				suit:null,
				color:null,
				interlockIndex:null
			};
			ret[index] = pkInfo;

			pkInfo["number"] = this.getPokerNumber(pkNumber);

			const suit = this.getPokerSuit(pkNumber);
			const isBlack = suit === "club" || suit === "spade";
			pkInfo["color"] = isBlack?"b":"r";
			pkInfo["suit"] = suit;
			if(i === len){
				pkInfo["interlockIndex"] = -1;
				continue;
			}
			const nextPK = ret[index+1];
			if(nextPK["interlockIndex"] !== -1 && nextPK["interlockIndex"] === null){
				continue;
			}
			if(nextPK["interlockIndex"] === null){
				continue;
			}

			const isSameColor = nextPK["color"] === pkInfo["color"];
			if(isSameColor)
				continue;

			const isNextNumber = this.pkConvertToNumber(nextPK["number"]) === this.pkConvertToNumber(pkInfo["number"]) -1;
			if(!isNextNumber)
				continue;
			pkInfo["interlockIndex"] = index+1;			
		}
		return ret;
	}

	// 取得拖曳的結果
	getDropResultCode(tarInfo , transferData){
		const cardExist = tarInfo.pkNumber !== "empty";
		const tColor = tarInfo.color;
		const tSuit = tarInfo.suit;
		const tNumber = this.pkConvertToNumber(tarInfo.number);
		

		const sourceAreaIndex = transferData.sourceAreaIndex;
		const sourceInfoList = transferData.moveInfoList;
		const isLenOver = sourceInfoList.length !==1;
		const sColor = sourceInfoList[0].color;
		const sSuit = sourceInfoList[0].suit;
		const sNumber = this.pkConvertToNumber(sourceInfoList[0].number);

		const allowCount = transferData.allowCount;
		const isFreeCellOverLength = sourceInfoList.length > allowCount ;
		const isFromCompilation = parseInt(sourceAreaIndex /20) === 1; 

		let ret = "";
		let colorPair = false;
		let numberPair = false;
		switch(this.areaType){
			case "freeCell"://接龍區
				
				colorPair = tColor !== sColor;
				numberPair = tNumber-1 === sNumber;
				ret =  !isFreeCellOverLength && colorPair && numberPair && !isFromCompilation ? "accept": "reject";
				break;
			case "temporary"://暫存區				
				// !== null || sourceInfo !== undefined;
				ret =  !cardExist && !isLenOver && !isFromCompilation? "accept": "reject";
				break;
			case "compilation"://歸類區
				colorPair = tSuit === sSuit || !cardExist;
				const isFirst = sNumber === 1 && !cardExist;
				numberPair = tNumber+1 === sNumber || isFirst;
				ret =  colorPair && numberPair && !isLenOver ? "accept": "reject";
				break;

		}	

		return ret;	
	}

	rollBackCallBack(type , number , suit){

		const index = this.recordList.findIndex((record)=>{
			return record["number"] === number && record["suit"] === suit;
		});
		if(index === -1)
			return;
		const recordPkNumber = this.recordList[index]["pkNumber"];
		switch(type){
			case "deleteCard":
				const delIndex = this.pkNumberList.findIndex((pkNumber)=>{
					return recordPkNumber ===pkNumber;
				});
				this.pkNumberList.splice(delIndex , 1);
				break;
			case "insertCard":
				this.pkNumberList.push(recordPkNumber);
				break;
		}
		this.recordList.splice(index, 1);
		if(this.recordList.length > 0)
			return;
		const area = {
			index:this.areaIndex,
			react:null
		}
		switch(type){
			case "deleteCard":
				this.props.transferCenter(area ,"rollBackNext",null);
				break;
			case "insertCard":
				this.props.transferCenter(area ,"rollBackDone",null);
				break;
		}
		this.state.areaState = "refresh";

	}
}
//卡套
function PokerHolder(props){
	const { children, index, spacing, Draggable,state} = props;
	const style={
		top: index * spacing
	};
	const isDragging = state === "dragging" || state === "movingLock";
	const isDelete = state === "deleteCard";
	const isInsert = state === "insertCard";
	const isEmpty = state === "empty";
	const isHover = state === "dragIn";

	const isDragArea = props.onPokerDragEnter !== null;
	const pkClassName = `${isEmpty?"empty":""} pokerHolder ${isDragging?"dragging":""} ${isHover?"hover empty":""}`		


	return(
		<div className={pkClassName} draggable={Draggable} style={style}
			onDragStart={(e)=>{props.onPokerDragStart(e , index)}}
			onDrag={(e)=>{props.onPokerDrag(e, index)}}
			onDragEnd={
				(e)=>{
					props.onPokerDragEnd(e, index)
				}
			}

			onDragEnter={
				(e)=>{
					if(isDragArea)
						props.onPokerDragEnter(e, index)
				}
			}
			onDragOver={
				(e)=>{
					if(isDragArea)
						props.onPokerDragOver(e, index)
				}
			}
			onDragLeave={
				(e)=>{
					if(isDragArea)
						props.onPokerDragLeave(e, index)
				}
			}
			onDrop={
				(e)=>{
					if(isDragArea)
						props.onPokerDrop(e, index)
				}
			}
			>
			{children}
		</div>
		);
}



class Poker extends React.Component{
	constructor(props){
		super(props);
		this.getSuitClass = this.getSuitClass.bind(this);
		this.setOpacity = this.setOpacity.bind(this);
		const pokerState  = this.props.state === "insertCard"? 0: 1;

		this.state = {opacity:pokerState};
	}
	getSuitClass(suit){
		let ret = "card ";
		switch(suit){
			case "spade":
				ret += "suitspades";
				break;
			case "heart":
				ret += "suithearts";
				break;
			case "diamond":
				ret += "suitdiamonds";
				break;
			case "club":
				ret += "suitclubs";
				break;
		}
		return ret;
	}
	setOpacity(number,suit,state){
		const pokerState = this.props.state;

		if(pokerState === "deleteCard"){
			if(this.state.opacity <= 0){
				this.props.rollBackCallBack(pokerState,number,suit);
				return;
			}
					
			setTimeout(()=>{
				const nowOpacity = this.state.opacity - 0.2;
				this.setState({opacity:nowOpacity});
			},100);

		} else if(pokerState === "insertCard"){

			if(this.state.opacity >= 1){
				this.props.rollBackCallBack(pokerState,number,suit);
				return;
			}					
			setTimeout(()=>{
				const nowOpacity = this.state.opacity + 0.2;
				this.setState({opacity:nowOpacity});
			},100);
		}
	}

	render(){
		const {number,suit,state} = this.props;
		const suitClass = this.getSuitClass(suit);
		this.setOpacity(number,suit,state);
		const pokerStyle = {
			opacity:this.state.opacity
		};
		return(
			<div className="pokerCard" style={pokerStyle}>
				<div className={suitClass}>
				  <div className="front">
				    <div className="spotTop">{number}</div>
				    <PokerContent number={number}/>
				    <div className="spotBottom">{number}</div>		    
				  </div>
				</div>
			</div>
			);
	}
}

function PokerContent(props){
	const number =props.number;
	const cardGroup = {
		A : ["spotAce"],
		2 : ["spotB1","spotB5"],
		3 : ["spotB1","spotB3","spotB5"],
		4 : ["spotA1","spotA5","spotC1","spotC5"],
		5 : ["spotA1","spotA5","spotB3","spotC1","spotC5"],
		6 : ["spotA1","spotA3","spotA5","spotC1","spotC3","spotC5"],
		7 : ["spotA1","spotA3","spotA5","spotB3","spotC1","spotC3","spotC5"],
		8 : ["spotA1","spotA3","spotA5","spotB2","spotB4","spotC1","spotC3","spotC5"],
		9 : ["spotA1","spotA2","spotA4","spotA5","spotB3","spotC1","spotC2","spotC4","spotC5"],
		10 : ["spotA1","spotA2","spotA4","spotA5","spotB2","spotB4","spotC1","spotC2","spotC4","spotC5"],
		J : ["face Jack"],
		Q : ["face Queen"],
		K : ["face King"]	
	};
	const contentParam = cardGroup[number];
	return(

			<div className="card_content">
				{contentParam.map((item)=>{
					return <div className={item}></div>;
				})}
			</div>
			);
}