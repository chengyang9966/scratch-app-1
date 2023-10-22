import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { useAppContext } from "../lib/contextLib";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Notes.css";
import { s3Upload } from "../lib/awsLib";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
export default function Notes() {
  const file = useRef(null);
  const { id } = useParams();
  const nav = useNavigate();
  const [note, setNote] = useState(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const { setErrorMsg } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    function loadNote() {
      return API.get("notes", `/notes/${id}`);
    }

    async function onLoad() {
      try {
        const note = await loadNote();
        const { content, attachment,title } = note;

        if (attachment) {
          note.attachmentURL = await Storage.vault.get(attachment);
        }

        setTitle(title);
        setContent(content);
        setNote(note);
      } catch (e) {
        setErrorMsg(current=>[...current,{message:e,title:'Get Notes'}])
      }
    }

    onLoad();
// eslint-disable-next-line
  }, [id]);

  function validateForm() {
    return content.length > 0;
  }
  
  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }
  
  function handleFileChange(event) {
    file.current = event.target.files[0];
  }
  
  function saveNote(note) {
    return API.put("notes", `/notes/${id}`, {
      body: note,
    });
  }
  
  async function handleSubmit(event) {
    let attachment;
  
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
      if (file.current) {
        attachment = await s3Upload(file.current);
      }
  
      await saveNote({
        title,
        content,
        attachment: attachment || note.attachment,
      });
      nav("/");
    } catch (e) {
        setErrorMsg(current=>[...current,{message:e,title:'Upload Note'}])
      setIsLoading(false);
    }
  }
  function deleteNote() {
    return API.del("notes", `/notes/${id}`);
  }
  
  async function handleDelete(event) {
    event.preventDefault();
  
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );
  
    if (!confirmed) {
      return;
    }
  
    setIsDeleting(true);
  
    try {
      await deleteNote();
      nav("/");
    } catch (e) {
        setErrorMsg(current=>[...current,{message:e,title:'Delete Note'}])
      setIsDeleting(false);
    }
  }
  
  return (
    <div className="Notes">
      {note && (
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
            {/* <Form.Control
              as="textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            /> */}
            <ReactQuill style={{height:400,margin:`10px 0px`}} theme="snow" value={content} onChange={setContent} />
          </Form.Group>
          <Form.Group controlId="file"  style={{marginTop:70}}  >
            <Form.Label>Attachment</Form.Label>
            {note.attachment && (
              <p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={note.attachmentURL}
                >
                  {formatFilename(note.attachment)}
                </a>
              </p>
            )}
            <Form.Control onChange={handleFileChange} type="file" />
          </Form.Group>
          <LoaderButton
            block="true"
            size="lg"
            type="submit"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoaderButton>
          <LoaderButton
            block="true"
            size="lg"
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </Form>
      )}
    </div>
  );
}