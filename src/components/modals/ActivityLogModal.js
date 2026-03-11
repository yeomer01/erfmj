import React, { useState } from 'react';
import { X, Activity, Edit2, Plus, Trash2, Upload, Send, RotateCcw, History, Loader2, PlusCircle, CheckCircle2, CreditCard, Hammer, AlertTriangle, Search } from 'lucide-react';
import { useActivityLogs } from '../../hooks/useActivityLogs';
import { useDeletedDefects } from '../../hooks/useDeletedDefects';
import { formatTimeAgo, formatDate, formatCurrency } from '../../utils/formatters';

export function ActivityLogModal({ isOpen, onClose, user }) {
  const { logs, loading: logsLoading } = useActivityLogs(user);
  const { deletedItems, loading: deletedLoading } = useDeletedDefects(user);
  const [activeTab, setActiveTab] = useState('logs'); // 'logs' or 'deleted'
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(log => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (log.summary && log.summary.toLowerCase().includes(term)) ||
      (log.details && log.details.toLowerCase().includes(term)) ||
      (log.user && log.user.toLowerCase().includes(term)) ||
      (log.action && log.action.toLowerCase().includes(term))
    );
  });

  const filteredDeletedItems = deletedItems.filter(item => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (item.vendor && item.vendor.toLowerCase().includes(term)) ||
      (item.productName && item.productName.toLowerCase().includes(term)) ||
      (item.defectContent && item.defectContent.toLowerCase().includes(term)) ||
      (item.color && item.color.toLowerCase().includes(term)) ||
      (item.size && String(item.size).toLowerCase().includes(term)) ||
      (item.manager && item.manager.toLowerCase().includes(term)) ||
      (item.deletedBy && item.deletedBy.toLowerCase().includes(term))
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center z-[90] p-4 animate-in fade-in duration-200">
      <div className="bg-white shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col rounded-xl overflow-hidden border border-stone-200">
        <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-stone-50">
          <div className="flex items-center gap-6">
            <h3 className="text-lg font-bold text-stone-800 flex items-center gap-2"><History size={20} className="text-stone-500" />시스템 기록</h3>
            <div className="flex bg-stone-200/50 p-1 rounded-lg">
              <button onClick={() => setActiveTab('logs')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'logs' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}>활동 로그</button>
              <button onClick={() => setActiveTab('deleted')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-1.5 ${activeTab === 'deleted' ? 'bg-white text-rose-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}><Trash2 size={14} />삭제된 항목 보관소</button>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-stone-200 rounded-full transition-colors"><X size={20} className="text-stone-400" /></button>
        </div>

        <div className="px-6 py-3 border-b border-stone-100 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="text"
              placeholder={activeTab === 'logs' ? "활동 기록 검색 (내용, 담당자 등)..." : "삭제된 항목 검색 (업체명, 상품명, 불량내용 등)..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white transition-all shadow-inner"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-0 custom-scrollbar bg-white">
          {activeTab === 'logs' ? (
            logsLoading ? (
              <div className="p-10 text-center"><Loader2 className="w-8 h-8 text-stone-300 animate-spin mx-auto mb-2" /><p className="text-xs text-stone-400">기록을 불러오는 중...</p></div>
            ) : filteredLogs.length === 0 ? (
              <div className="p-10 text-center text-stone-400 text-sm"><Activity className="w-10 h-10 mx-auto mb-3 opacity-20" />{searchTerm ? '검색 결과가 없습니다.' : '아직 활동 기록이 없습니다.'}</div>
            ) : (
              <div className="divide-y divide-stone-100">
                {filteredLogs.map((log) => {
                  let icon = Activity;
                  let colorClass = "text-stone-400 bg-stone-100";
                  if (log.action === '등록' || log.action === '빠른 등록') { icon = PlusCircle; colorClass = "text-blue-600 bg-blue-50"; }
                  else if (log.action === '수정' || log.action === '수정 (인라인)') { icon = Edit2; colorClass = "text-amber-600 bg-amber-50"; }
                  else if (log.action === '삭제') { icon = Trash2; colorClass = "text-rose-600 bg-rose-50"; }
                  else if (log.action === 'CSV 업로드') { icon = Upload; colorClass = "text-emerald-600 bg-emerald-50"; }
                  else if (log.action === '차감 확정' || log.action === '차감 요청') { icon = CheckCircle2; colorClass = "text-purple-600 bg-purple-50"; }
                  else if (log.action === '차감 취소' || log.action === '요청 취소') { icon = RotateCcw; colorClass = "text-orange-600 bg-orange-50"; }
                  else if (log.action === '재결제') { icon = CreditCard; colorClass = "text-green-600 bg-green-50"; }
                  else if (log.action === '차감후수선') { icon = Hammer; colorClass = "text-indigo-600 bg-indigo-50"; }
                  else if (log.action === '일괄 재결제') { icon = CreditCard; colorClass = "text-green-600 bg-green-50"; }
                  const IconComp = icon;
                  return (
                    <div key={log.id} className="p-4 hover:bg-stone-50 transition-colors flex gap-3 items-start">
                      <div className={`p-2 rounded-lg ${colorClass} mt-0.5 flex-shrink-0`}><IconComp size={16} /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-bold text-stone-800">{log.summary}</span>
                          <span className="text-[10px] text-stone-400 font-mono whitespace-nowrap ml-2">{formatTimeAgo(log.timestamp)}</span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5 line-clamp-2 text-center">{log.details}</p>
                        <div className="flex items-center gap-2 mt-2 justify-center">
                          <span className="text-[10px] bg-stone-100 px-1.5 py-0.5 rounded text-stone-500 font-bold border border-stone-200">{log.user}</span>
                          <span className="text-[10px] text-stone-300">|</span>
                          <span className="text-[10px] text-stone-400 font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            deletedLoading ? (
              <div className="p-10 text-center"><Loader2 className="w-8 h-8 text-rose-300 animate-spin mx-auto mb-2" /><p className="text-xs text-stone-400">삭제된 내역을 불러오는 중...</p></div>
            ) : filteredDeletedItems.length === 0 ? (
              <div className="p-10 text-center text-stone-400 text-sm"><Trash2 className="w-10 h-10 mx-auto mb-3 opacity-20" />{searchTerm ? '검색 결과가 없습니다.' : '보관된 삭제 내역이 없습니다.'}</div>
            ) : (
              <div className="p-0">
                <div className="bg-rose-50 border-b border-rose-100 p-3 flex items-start gap-2 text-rose-700 text-xs">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <p>이곳은 삭제된 데이터가 영구 보관되는 장소입니다. 기록 확인용이며 시스템 집계에는 포함되지 않습니다.</p>
                </div>
                <table className="w-full text-xs text-center border-collapse">
                  <thead className="bg-stone-50 text-stone-500 font-bold sticky top-0 border-b border-stone-200 shadow-sm">
                    <tr>
                      <th className="px-3 py-2">삭제일시</th>
                      <th className="px-3 py-2">삭제자</th>
                      <th className="px-3 py-2 border-l border-stone-200">불량확인일</th>
                      <th className="px-3 py-2">업체명</th>
                      <th className="px-3 py-2">상품명</th>
                      <th className="px-3 py-2">색상/사이즈</th>
                      <th className="px-3 py-2">수량</th>
                      <th className="px-3 py-2">불량내용</th>
                      <th className="px-3 py-2">담당자</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredDeletedItems.map((item) => (
                      <tr key={item.id} className="hover:bg-rose-50/30 transition-colors">
                        <td className="px-3 py-2 font-mono text-[10px] text-rose-600 font-medium">
                          {new Date(item.deletedAt).toLocaleString()}
                        </td>
                        <td className="px-3 py-2">
                          <span className="bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200 font-bold text-stone-600">{item.deletedBy}</span>
                        </td>
                        <td className="px-3 py-2 text-stone-500 border-l border-stone-50">{formatDate(item.checkDate)}</td>
                        <td className="px-3 py-2 font-bold text-stone-800">{item.vendor}</td>
                        <td className="px-3 py-2 text-stone-600">{item.productName}</td>
                        <td className="px-3 py-2 text-stone-500">{item.color} / {item.size}</td>
                        <td className="px-3 py-2 font-bold text-stone-800">{item.quantity}</td>
                        <td className="px-3 py-2 text-stone-500 max-w-[150px] truncate" title={item.defectContent}>{item.defectContent}</td>
                        <td className="px-3 py-2 text-stone-500">{item.manager || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
