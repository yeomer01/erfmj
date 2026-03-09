import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, CheckCircle, AlertTriangle } from 'lucide-react';

export function AIPhotoUploadModal({ isOpen, onClose, onApply }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      setAnalysisResult(null);
    }
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    
    // 임의의 결과 세트 생성
    const mockResults = [
      { vendor: '오델리아', productName: '하프 넥 니트', color: 'IVORY', size: 'FREE', defectContent: '원단 이염 (AI 판독)' },
      { vendor: '테스트 업체', productName: '제제후(n555)', color: '오트밀', size: 'S', defectContent: '오른팔 잡사' },
      { vendor: '블루체리', productName: '기본 라운드티', color: 'BLACK', size: 'M', defectContent: '넥라인 박음질 불량' },
      { vendor: '마이어페럴', productName: '데님 와이드 팬츠', color: 'BLUE', size: 'L', defectContent: '지퍼 불량' },
      { vendor: '모의 업체 A', productName: '샘플 자켓', color: 'NAVY', size: 'FREE', defectContent: '단추 탈락' }
    ];

    // 모의 분석 (2.5초 대기 후 랜덤 결과 배정)
    setTimeout(() => {
      setIsAnalyzing(false);
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setAnalysisResult({
        ...randomResult,
        confidence: Math.floor(Math.random() * (99 - 85 + 1)) + 85 // 85% ~ 99% 랜덤 신뢰도
      });
    }, 2500);
  };

  const handleApply = () => {
    if (onApply && analysisResult) {
      onApply(analysisResult);
    }
    closeModal();
  };

  const closeModal = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-stone-200 flex justify-between items-center bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <Upload size={18} />
            </div>
            <h2 className="text-lg font-bold text-stone-800">AI 불량 사진 분석 (테스트 모드)</h2>
          </div>
          <button onClick={closeModal} className="text-stone-400 hover:text-stone-800 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {!selectedImage ? (
            <div 
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-stone-300 bg-stone-50 hover:bg-stone-100 hover:border-stone-400'}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
              style={{ cursor: 'pointer', minHeight: '250px' }}
            >
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-stone-200">
                <ImageIcon size={32} className="text-stone-400" />
              </div>
              <p className="font-bold text-stone-700 text-base mb-1">불량 사진을 업로드하세요</p>
              <p className="text-stone-400 text-xs text-center">클릭하거나 사진을 이곳으로 드래그 & 드롭<br/>(테스트 모드: 실제 서버에 전송되지 않음)</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-100 flex items-center justify-center h-[250px]">
                <img src={selectedImage} alt="Uploaded" className="max-h-full object-contain" />
                <button 
                  onClick={() => { setSelectedImage(null); setAnalysisResult(null); }}
                  className="absolute top-2 right-2 bg-stone-900/60 hover:bg-rose-600 text-white rounded-full p-1.5 transition-colors backdrop-blur-sm"
                  title="사진 변경"
                >
                  <X size={16} />
                </button>
                
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                    <Loader2 size={40} className="animate-spin text-indigo-400 mb-3" />
                    <p className="font-bold tracking-wide">AI가 불량 유형을 분석 중입니다...</p>
                    <p className="text-xs text-stone-300 mt-1">잠시만 기다려주세요</p>
                  </div>
                )}
              </div>

              {!isAnalyzing && !analysisResult && (
                <button 
                  onClick={startAnalysis}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <AlertTriangle size={18} /> 시작하기
                </button>
              )}

              {analysisResult && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 animate-in slide-in-from-bottom-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                    <h3 className="font-bold text-indigo-900 flex items-center gap-1.5"><CheckCircle size={16} className="text-indigo-600" /> 분석 완료</h3>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">신뢰도: {analysisResult.confidence}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                    <div className="flex flex-col"><span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">업체</span><span className="font-medium text-indigo-900">{analysisResult.vendor}</span></div>
                    <div className="flex flex-col"><span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">상품명</span><span className="font-medium text-indigo-900">{analysisResult.productName}</span></div>
                    <div className="flex flex-col"><span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">색상/사이즈</span><span className="font-medium text-indigo-900">{analysisResult.color} / {analysisResult.size}</span></div>
                    <div className="flex flex-col"><span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">불량 판독</span><span className="font-bold text-rose-600">{analysisResult.defectContent}</span></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex justify-end gap-2">
          <button onClick={closeModal} className="px-4 py-2 border border-stone-300 bg-white text-stone-600 font-bold rounded-md hover:bg-stone-100 transition-colors">
            닫기
          </button>
          {analysisResult && (
            <button onClick={handleApply} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-1.5" title="분석 결과를 화면에 적용합니다">
              적용하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
