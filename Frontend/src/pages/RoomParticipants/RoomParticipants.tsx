import React, { FormEvent, FunctionComponent, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChangeParticipantStatusBody, roomParticipantApiDeclaration, roomsApiDeclaration } from '../../apiDeclarations';
import { Field } from '../../components/FieldsBlock/Field';
import { Loader } from '../../components/Loader/Loader';
import { MainContentWrapper } from '../../components/MainContentWrapper/MainContentWrapper';
import { SubmitField } from '../../components/SubmitField/SubmitField';
import { useApiMethod } from '../../hooks/useApiMethod';
import { Room } from '../../types/room';
import { Localization } from '../../localization';

const userFieldName = 'user';
const userTypeFieldName = 'userType';

export const RoomParticipants: FunctionComponent = () => {
  let { id } = useParams();
  const { apiMethodState, fetchData } = useApiMethod<Room, Room['id']>(roomsApiDeclaration.getById);
  const { process: { loading, error }, data: room } = apiMethodState;

  const {
    apiMethodState: changeParticipantStatusState,
    fetchData: changeParticipantStatusFetch,
  } = useApiMethod<object, ChangeParticipantStatusBody>(roomParticipantApiDeclaration.changeParticipantStatus);
  const {
    process: { loading: changeParticipantStatusLoading, error: changeParticipantStatusError },
    data: changeParticipantStatusData,
  } = changeParticipantStatusState;

  useEffect(() => {
    if (!id) {
      throw new Error('Room id not found');
    }
    fetchData(id);
  }, [id, fetchData]);

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) {
      throw new Error('Room id not found');
    }
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    const userId = data.get(userFieldName);
    if (!userId) {
      return;
    }
    if (typeof userId !== 'string') {
      throw new Error('userNickname field type error');
    }
    const userType = data.get(userTypeFieldName);
    if (!userType) {
      return;
    }
    if (typeof userType !== 'string') {
      throw new Error('userType field type error');
    }
    changeParticipantStatusFetch({
      roomId: id,
      userId,
      userType,
    });
  }, [id, changeParticipantStatusFetch]);

  const renderMainContent = useCallback(() => {
    if (loading || !room) {
      return (
        <Field>
          <Loader />
        </Field>
      )
    }

    if (error) {
      <Field>
        <div>Error: {error}</div>
      </Field>
    }

    return (
      <form action="" onSubmit={handleSubmit}>
        <Field>
          <select name={userFieldName}>
            {room.users.map(user => (
              <option key={user.id} value={user.id}>{user.nickname}</option>
            ))}
          </select>
          <select name={userTypeFieldName}>
            <option value="Viewer">{Localization.Viewer}</option>
            <option value="Expert">{Localization.Expert}</option>
            <option value="Examinee">{Localization.Examinee}</option>
          </select>
        </Field>
        <SubmitField caption={Localization.Save} />
        {changeParticipantStatusLoading && (
          <Field><div>Changing participant status...</div></Field>
        )}
        {changeParticipantStatusError && (
          <Field><div>Changing participant status error: {changeParticipantStatusError}</div></Field>
        )}
        {changeParticipantStatusData && (
          <Field><div>Successfully changed participant status</div></Field>
        )}
      </form>
    )
  }, [
    loading,
    changeParticipantStatusLoading,
    error,
    changeParticipantStatusError,
    room,
    changeParticipantStatusData,
    handleSubmit,
  ]);

  return (
    <MainContentWrapper>
      {renderMainContent()}
    </MainContentWrapper>
  );
};
