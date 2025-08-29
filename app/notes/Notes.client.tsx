"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes } from "../../lib/api";
import { FetchNotesResponse } from "@/lib/api";
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import Pagination from "../../components/Pagination/Pagination";
import NoteList from "../../components/NoteList/NoteList";
import SearchBox from "../../components/SearchBox/SearchBox";
import NoteModal from "../../components/Modal/Modal";
import NoteForm from "../../components/NoteForm/NoteForm";
import Loader from "../../components/Loader/Loader";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import css from "./NotesClient.module.css";

type Props = {
  initialData: FetchNotesResponse;
};

export default function NotesClient({ initialData }: Props) {
  // стани (для пошуку searchQuery (стан пошуку))
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { data, isLoading, error, isError, isSuccess } = useQuery({
    queryKey: ["notes", searchQuery, currentPage],
    queryFn: () =>
      fetchNotes({ search: searchQuery || "", page: currentPage, perPage: 12 }),
    placeholderData: keepPreviousData,
    initialData,
  });
  const totalPages = data?.totalPages ?? 0;

  const updateSearchQuery = useDebouncedCallback((newSearchQuery: string) => {
    setSearchQuery(newSearchQuery);
    setCurrentPage(1);
  }, 300);

  useEffect(() => {
    if (isSuccess && data?.notes?.length === 0) {
      toast.error("Any notes found for your request.");
    }
  }, [isSuccess, data]);

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <Toaster position="top-center" />
          <SearchBox onSearch={updateSearchQuery} />
          {isLoading && <Loader />}
          {isError && (
            <ErrorMessage
              message={error instanceof Error ? error.message : "Unknown error"}
            />
          )}
          {isSuccess && totalPages > 1 && (
            <Pagination
              page={currentPage}
              total={totalPages}
              onChange={setCurrentPage}
            />
          )}
          <button className={css.button} onClick={openModal}>
            Create note +
          </button>
        </header>
        {data?.notes && data?.notes.length > 0 && (
          <NoteList notes={data?.notes} />
        )}
        {error && <strong>Ooops there was an error...</strong>}
        {isModalOpen && (
          <NoteModal onClose={closeModal}>
            <NoteForm onCloseModal={closeModal} />
          </NoteModal>
        )}
      </div>
    </>
  );
}
