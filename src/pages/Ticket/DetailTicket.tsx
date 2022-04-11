import React, { useEffect, useState, useRef } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { FiClock, FiArrowLeft } from "react-icons/fi";

import Button from "../../shared/components/Button";
import Comment from "../../shared/interfaces/comment.interface";
import Container from "../../shared/components/Container";
import Footer from "../../shared/components/Footer";
import Header from "../../shared/components/Header";
import PriorityLevelBadge from "../../shared/components/PriorityLevelBadge";
import StatusTicket from "../../shared/components/StatusTicket";
import Ticket from "../../shared/interfaces/ticket.interface";
import TicketComment from "../../shared/components/TicketComment";
import TicketAddComment from "../../shared/components/TicketAddComment";

import { TicketRequests } from "../../shared/utils/requests/Ticket.requests";

import "../../shared/styles/pages/ticket/DetailTicket.css";
import SessionController from "../../shared/utils/handlers/SessionController";

export default function DetailTicket() {
  const navigate = useNavigate();
  const { id } = useParams();

  const formCommentRef = useRef({
    submit: () => {
      return { newComment: "" };
    },
  });

  const [ticket, setTicket] = useState<Ticket>();
  const [comments, setComments] = useState<Ticket["comments"]>([]);
  const [createdAt, setCreatedAt] = useState<Date>();

  const ticketRequest = new TicketRequests();

  useEffect(() => {
    const subscribe = getTicket();

    return () => {
      subscribe.finally();
    };
  }, []);

  const getTicket = async () => {
    const response: Ticket = await ticketRequest.showRequest(id ?? "");

    setTicket(response);
    setComments(response.comments);

    const date = new Date(response.createdAt);
    setCreatedAt(date);
  };

  const handleSubmitComment = async () => {
    const { newComment } = formCommentRef.current.submit();

    const user = SessionController.getUserInfo();

    if (!user) return alert("Não foi possível inserir comentário");

    const comment: Comment = {
      comment: newComment,
      ownerComment: user,
    };

    try {
      const response = await ticketRequest.insertComment(id ?? "", comment);

      if (response?.status === 200) {
        alert("Comentário adicionado");
        setComments((prevState) => {
          return [...prevState, comment];
        });
      }
      console.log(response);
    } catch (error) {}
  };

  return (
    <Container>
      <Header />
      <main id="detail-ticket">
        <section className="ticket-about">
          <FiArrowLeft
            className="navigation-button"
            color="var(--color-gray-dark)"
            onClick={() => {
              navigate("/");
            }}
          />
          <h1 className="ticket-name">{ticket?.title ?? "Carregando..."}</h1>

          <p>Protocólo: #{ticket?.id ?? "..."}</p>
          <p>
            <span className="detail-date-created">
              <FiClock color="var(--color-gray-dark)" size="0.8rem" />{" "}
              {createdAt?.toLocaleString("pt-br") ?? "..."}
            </span>
            <StatusTicket status={ticket?.status} />
          </p>
        </section>

        <section className="ticket-priority">
          <h3>Grau de prioridade:</h3>
          <PriorityLevelBadge priority={ticket?.priorityLevel} />
        </section>

        <section>
          <h3>Descrição do problema:</h3>
          <div className="description-problem">
            <p>{ticket?.description ?? "..."}</p>
            <p className="owner-comment">{ticket?.user.email}</p>
          </div>
        </section>

        {comments.length !== 0 ? (
          <section>
            <h3>Discussão</h3>
            <ul className="comments-block">
              {comments.map((comment, index) => (
                <TicketComment commentData={comment} key={index} />
              ))}
            </ul>
          </section>
        ) : null}

        <section id="add-comment-container">
          <TicketAddComment ref={formCommentRef} />
          <div className="button-container">
            <Button
              backgroundColor="transparent"
              color="var(--color-black-dark)"
              width="4rem"
              height="2rem"
              fontSize="0.8rem"
              fontWeight="600"
              border="1px solid var(--color-black-main)"
              onClick={handleSubmitComment}
            >
              Enviar
            </Button>
          </div>
        </section>

        {/* Removido temporáriamente por falta de definição */}
        {/* <section className="ticket-resolve-content">
          <h3>A resolução adicionada pelo suporte foi útil?</h3>
          <div>
            <Button
              backgroundColor="var(--color-green)"
              color="#FFFFFF"
              width="7rem"
              height="2rem"
            >
              Sim
            </Button>
            <Button
              backgroundColor="var(--color-red)"
              color="#FFFFFF"
              width="7rem"
              height="2rem"
            >
              Não
            </Button>
          </div>
        </section> */}
      </main>
      <Footer />
    </Container>
  );
}
