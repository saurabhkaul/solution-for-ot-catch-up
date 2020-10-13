//operations -> [insert,chars] [delete,count] [skip,count]



function doInsert(document,currentPosition,ot){
  const textToInsert = ot.chars;
  const newDocument = document.slice(0,currentPosition) + textToInsert + document.slice(currentPosition)
  return [newDocument, currentPosition]
  
}

function doDelete(document,currentPosition,ot){
  const deleteCount = ot.count;
  const docLength = document.length;
  if(deleteCount+currentPosition > docLength){
    return [null,null] 
  }
  const newDocument = document.replace(document.slice(currentPosition,deleteCount+currentPosition),'')
  return [newDocument,currentPosition] 
}

function doSkip(document,currentPosition,ot){
  const skipCount = ot.count;
  const docLength = document.length;
  if(skipCount + currentPosition > docLength){
    return[null, null]
  }
  const newPosition = currentPosition + skipCount;
  return [document,newPosition]

}

function commitOperationalTransform(document,currentPosition,ot){
  const operation = ot.op;

  let newDocument, newPosition;
  switch (operation){
    case 'insert': 
      [newDocument, newPosition] = doInsert(document,currentPosition,ot);
      break;
    case 'delete': 
      [newDocument, newPosition] = doDelete(document,currentPosition,ot);
      break;
    case 'skip':
      [newDocument, newPosition] = doSkip(document,currentPosition,ot);
      break;
    default:
      return [document,currentPosition];                            
  }
  if(newPosition === null){
    return [null,null]
  }else{
    return [newDocument,newPosition]
  }
}

function isValid(stale, latest, otjson){
  otjson = JSON.parse(otjson)
  let staleCopy = stale;
  let currentPosition = 0;
  const updateStaleCopy = (newCopy) => staleCopy = newCopy;
  const updatePosition = (count) => currentPosition = currentPosition + count; 
  let isValid = true;
  otjson.forEach((ot)=>{
    const [newDocument, newPosition] = commitOperationalTransform(staleCopy,currentPosition,ot)
    if(newPosition == null){
      isValid = false;
    }
    updateStaleCopy(newDocument);
    updatePosition(newPosition)

  })
  console.log('final document', staleCopy)
  console.log('final position', currentPosition)
  return isValid
}

const test = isValid(
  'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
  'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
  '[]'
);

console.log(test)

