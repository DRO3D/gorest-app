import { Button } from '@consta/uikit/Button';
import { Select } from '@consta/uikit/Select';
import { Text } from '@consta/uikit/Text';

interface PaginationProps {
  page: number;
  pages: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

const PER_PAGE_OPTIONS: Array<{ label: string; value: number }> = [
  { label: '10', value: 10 },
  { label: '25', value: 25 },
  { label: '50', value: 50 },
];

function getPageNumbers(current: number, total: number): (number | 'gap')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const result: (number | 'gap')[] = [1];
  const start = Math.max(2, current - 2);
  const end = Math.min(total - 1, current + 2);
  if (start > 2) result.push('gap');
  for (let i = start; i <= end; i++) result.push(i);
  if (end < total - 1) result.push('gap');
  result.push(total);
  return result;
}

export function Pagination({
  page,
  pages,
  total,
  perPage,
  onPageChange,
  onPerPageChange,
}: PaginationProps) {
  const selected = PER_PAGE_OPTIONS.find((o) => o.value === perPage) ?? PER_PAGE_OPTIONS[0];
  const numbers = getPageNumbers(page, pages || 1);

  return (
    <div className="pagination-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Text size="s" view="secondary">
          Всего: {total}
        </Text>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Text size="s" view="secondary">
            На странице:
          </Text>
          <Select
            size="s"
            items={PER_PAGE_OPTIONS}
            value={selected}
            onChange={(value) => {
              if (value) onPerPageChange(value.value);
            }}
            getItemLabel={(item) => item.label}
            getItemKey={(item) => item.value}
            style={{ width: 80 }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Button
          size="s"
          view="secondary"
          label="Предыдущая"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        />
        <div className="page-numbers">
          {numbers.map((n, i) =>
            n === 'gap' ? (
              <Text key={`gap-${i}`} size="s" view="secondary" style={{ padding: '0 4px' }}>
                …
              </Text>
            ) : (
              <Button
                key={n}
                size="s"
                view={n === page ? 'primary' : 'ghost'}
                label={String(n)}
                onClick={() => onPageChange(n)}
              />
            )
          )}
        </div>
        <Button
          size="s"
          view="secondary"
          label="Следующая"
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
        />
      </div>
    </div>
  );
}
