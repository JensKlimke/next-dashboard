import {Auth, Storage} from 'aws-amplify';

export async function saveAvatar(file: File) {
  // get user
  const user = await Auth.currentAuthenticatedUser();
  // check file type
  let extension;
  if (file.type === 'image/jpeg')
    extension = 'jpg';
  else if (file.type === 'image/png')
    extension = 'png';
  else if (file.type === 'image/gif')
    extension = 'gif';
  else if (file.type === 'image/bmp')
    extension = 'bmp';
  else if (file.type === 'image/tif')
    extension = 'tif';
  else {
    throw new Error('filetype invalid');
  }
  // write to storage
  const filename = user.attributes.sub + '.' + extension;
  Storage.put(filename, file, {
    contentType: file.type
  })
    .then(result => {
      if(!result.key)
        throw new Error('err');
      Auth.updateUserAttributes(user, {
        picture: result.key
      })
        .then(() => Promise.resolve(true));
    })
    .catch(err => console.error(err));
}


export async function getAvatar(picture: string) {
  // load avatar data
  if (picture) {
    try {
      // return avatar on success
      return await Storage.get(picture);
    } catch (e) {
    }
  }
  // return null else
  return undefined;
}
