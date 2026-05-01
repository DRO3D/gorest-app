import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@consta/uikit/TextField';
import { Button } from '@consta/uikit/Button';
import { Text } from '@consta/uikit/Text';
import { ChoiceGroup } from '@consta/uikit/ChoiceGroup';
import { useAuth } from '../hooks/useAuth';

type ModeItem = { name: string; value: 'users' | 'posts' };

const MODES: ModeItem[] = [
  { name: 'Пользователи', value: 'users' },
  { name: 'Посты', value: 'posts' },
];

export function HomePage() {
  const { token, setToken, clearToken } = useAuth();
  const [tokenInput, setTokenInput] = useState<string>(token);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<ModeItem>(MODES[0]);
  const navigate = useNavigate();

  const handleSave = () => {
    const trimmed = (tokenInput ?? '').trim();
    if (!trimmed) {
      setError('Токен не может быть пустым');
      return;
    }
    setError(null);
    setToken(trimmed);
  };

  const handleGo = () => {
    if (!token) {
      setError('Сначала сохраните токен');
      return;
    }
    navigate(mode.value === 'users' ? '/users' : '/posts');
  };

  if (!token) {
    return (
      <div className="token-form">
        <Text as="h2" size="2xl" weight="bold" style={{ marginTop: 0, marginBottom: 16 }}>
          Введите Access Token
        </Text>
        <Text size="s" view="secondary" style={{ marginBottom: 16, display: 'block' }}>
          Получить токен:{' '}
          <a href="https://gorest.co.in/my-account/access-tokens" target="_blank" rel="noreferrer">
            gorest.co.in/my-account/access-tokens
          </a>
        </Text>
        <TextField
          placeholder="Bearer token"
          value={tokenInput}
          onChange={(value) => setTokenInput(value ?? '')}
          status={error ? 'alert' : undefined}
          caption={error ?? undefined}
          style={{ width: '100%' }}
        />
        <Button
          label="Сохранить"
          view="primary"
          onClick={handleSave}
          style={{ marginTop: 16 }}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: '40px auto' }}>
      <Text as="h2" size="2xl" weight="bold" style={{ marginTop: 0 }}>
        Главная
      </Text>
      <Text view="secondary" size="s" style={{ display: 'block', marginBottom: 16 }}>
        Токен сохранён. Выберите режим просмотра.
      </Text>

      <div style={{ marginBottom: 24 }}>
        <ChoiceGroup
          value={mode}
          onChange={(value: ModeItem) => setMode(value)}
          items={MODES}
          getItemLabel={(item: ModeItem) => item.name}
          name="mode"
          multiple={false}
        />
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <Button label="Открыть" view="primary" onClick={handleGo} />
        <Button label="Сменить токен" view="ghost" onClick={clearToken} />
      </div>
    </div>
  );
}