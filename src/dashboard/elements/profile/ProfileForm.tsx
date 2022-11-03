import React, {useEffect, useState} from 'react';
import {Alert, Button, Form, Image} from 'react-bootstrap';
import {useAuth} from "auth/contexts/auth";
import {useConfig} from "dashboard/contexts/config";
import styles from '../../../styles/Profile.module.css'

export default function ProfileForm () {

  const auth = useAuth();
  const config = useConfig();

  const [savingImage, setSavingImage] = useState(false);
  const [savingData, setSavingData] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState<string>();

  let fileInput = React.createRef<HTMLInputElement>();

  useEffect(() => {
    // check for user
    if(!auth || !auth.user)
      return;
    // set data
    setName(auth.user.name);
    setPhone(auth.user.phone || '');
    setImage(auth.user.avatar || '');
  }, [auth]);


  const submit = async (e : React.FormEvent<HTMLFormElement>) => {
    // enable loader
    setSavingData(true);
    // prevent default
    e.preventDefault();
    // send user data
    auth.changeAttributes && auth.changeAttributes(name, phone)
      .catch(e => e.message && setMessage(e.message))
      .then(() => setSavingData(false))
  };

  const openFileDialog = () => {
    if(fileInput && fileInput.current)
      fileInput.current.click();
  }

  const onProcessFile = (e : React.ChangeEvent<HTMLInputElement>) => {
    // set state
    setSavingImage(true);
    // prevent further event
    e.preventDefault();
    // get file and check
    let reader = new FileReader();
    if(!e.target.files) {
      setImage(null);
      return;
    }
    // get file content
    let file = e.target.files[0];
    try {
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
    }
    // write to image
    reader.onloadend = () => {
      if(reader.result)
        setImage(reader.result.toString());
    };
    // abort if user is not set
    if(!auth || !auth.user) {
      console.error('User is not available');
      return;
    }
    if(!auth.saveAvatar) {
      console.error('Avatar cannot be saved');
      return;
    }
    // save avatar
    auth.saveAvatar(file)
      .then(() => setSavingImage(false))
  };

  const isLoading = savingImage || savingData;

  return (
    <div className={styles.profileContainer}>
      <input
        type='file'
        accept='.jpg, .png, .jpeg, .gif, .bmp, .tif'
        onChange={onProcessFile}
        ref={fileInput}
        hidden={true}
      />
      <Image src={image || config.defaultAvatar?.src || ''} onClick={openFileDialog} className={styles.avatar} alt='avatar' />
      <Form onSubmit={submit}>
        <Form.Group className='mb-3' controlId='formName'>
          <Form.Label>Name</Form.Label>
          <Form.Control type='text' value={name} onChange={ (e) => setName(e.target.value) } placeholder='Enter your name' />
          <Form.Text className='text-muted'>
            Choose a name, with what other users can identify your account. Doesn&apos;t have to be your real or full name.
          </Form.Text>
        </Form.Group>
        <Form.Group className='mb-3' controlId='formPhone'>
          <Form.Label>Phone Number</Form.Label>
          <Form.Control type='tel' value={phone} onChange={ (e) => setPhone(e.target.value) } placeholder='Your phone number' />
          <Form.Text className='text-muted'>
            The phone number is used to give other users a contact possibility. If you don&apos;t what others to call you, leave that input blank.
          </Form.Text>
        </Form.Group>
        { message && <Alert variant='warning' onClose={() => setMessage(undefined)} dismissible>{message}</Alert> }
        <Button
          variant='primary'
          disabled={isLoading}
          type='submit'
        >
          {isLoading ? 'Saving…' : 'Save'}
        </Button>
      </Form>
    </div>
  )

}
