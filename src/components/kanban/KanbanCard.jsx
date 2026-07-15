import { Draggable } from '@hello-pangea/dnd';
import { Clock, Check } from 'lucide-react';

export default function KanbanCard({ job, index }) {
  return (
    <Draggable draggableId={job.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="group cursor-grab rounded-xl border border-gray-200 p-3 shadow-sm transition-all hover:shadow-md active:cursor-grabbing"
          style={{
            ...provided.draggableProps.style,
            // Card background: #F1F6F5 (light teal tint)
            // When dragging, keep it slightly elevated with the same tint
            backgroundColor: snapshot.isDragging ? '#E8F2F0' : '#F1F6F5',
            boxShadow: snapshot.isDragging
              ? '0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.08)'
              : undefined,
          }}
        >
          {/* ---- Vehicle name (top, bold) ---- */}
          <p className="text-sm font-bold text-gray-900">{job.vehicle}</p>

          {/* ---- Service (gray, below vehicle) ---- */}
          <p className="mt-0.5 text-xs text-gray-500">{job.service}</p>

          {/* ---- Customer + time (bottom row) ---- */}
          <div className="mt-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-50 text-[10px] font-bold text-[#0E5C5B]">
                {job.initials}
              </span>
              <span className="text-xs font-medium text-[#0E5C5B]">{job.customer}</span>
            </div>

            {job.done ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
                <Check className="h-3 w-3" />
                Done
              </span>
            ) : (
              job.time && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  {job.time}
                </span>
              )
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
