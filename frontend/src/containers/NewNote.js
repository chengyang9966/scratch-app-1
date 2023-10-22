import React, { useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./NewNote.css";
import { API } from "aws-amplify";
import { useAppContext } from "../lib/contextLib";
import { s3Upload } from "../lib/awsLib";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
export default function NewNote() {
  const { setErrorMsg } = useAppContext();
  const file = useRef(null);
  const nav = useNavigate();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return content.length > 0;
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  async function handleSubmit(event) {
    event.preventDefault();
  
    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }
  
    setIsLoading(true);
  
    try {
        const attachment = file.current ? await s3Upload(file.current) : null;
      await createNote({ content,attachment,title });
      nav("/");
    } catch (e) {
        setErrorMsg(current=>[...current,{message:e,title:'Create Notes'}])
      setIsLoading(false);
    }
  }
  
  function createNote(note) {
    return API.post("notes", "/notes", {
      body: note,
    });
  }
  return (
    <div className="NewNote">
      <Form onSubmit={handleSubmit}>
      <Form.Group size="lg" controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            autoFocus
            type="title"
            value={title}
            onChange={e=>setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="content" style={{margin:`10px 0px`}}>
        <ReactQuill style={{height:400,margin:`10px 0px`}} theme="snow" value={content} onChange={setContent} />
        </Form.Group>
        <Form.Group controlId="file" style={{marginTop:70}}>
          <Form.Label>Attachment</Form.Label>
          <Form.Control onChange={handleFileChange} type="file" />
        </Form.Group>
        <LoaderButton
          block
          type="submit"
          size="lg"
          variant="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </LoaderButton>
      </Form>
    </div>
  );
}