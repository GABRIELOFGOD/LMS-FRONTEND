"use client";

import { User } from "@/types/user";
import { useRef } from "react";

interface CompletionCertificateProps {
  user: User;
  courseTitle?: string;
  completionDate?: string;
  onDownload?: () => void;
}

const CompletionCertificate = ({ 
  user, 
  courseTitle = "All Courses",
  completionDate,
  onDownload 
}: CompletionCertificateProps) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const formatDate = (date?: string) => {
    if (!date) return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleDownload = async () => {
    if (onDownload) {
      onDownload();
      return;
    }

    try {
      // Import html2canvas and jsPDF dynamically
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      if (certificateRef.current) {
        // High quality capture settings
        const canvas = await html2canvas(certificateRef.current, {
          scale: 3, // Higher quality
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true,
          allowTaint: true,
          ignoreElements: (element) => {
            return element.tagName === 'svg';
          },
          onclone: (clonedDoc, clonedElement) => {
            // Remove ALL external stylesheets
            const stylesheets = clonedDoc.querySelectorAll('link[rel="stylesheet"], style');
            stylesheets.forEach(sheet => {
              if (sheet.parentNode) {
                sheet.parentNode.removeChild(sheet);
              }
            });
            
            // Get all elements
            const allElements = clonedDoc.body.querySelectorAll('*');
            
            allElements.forEach((el) => {
              if (el instanceof HTMLElement) {
                el.removeAttribute('class');
                el.removeAttribute('className');
                
                Array.from(el.attributes).forEach(attr => {
                  if (attr.name.startsWith('data-')) {
                    el.removeAttribute(attr.name);
                  }
                });
              }
            });
            
            // Ensure certificate container has only safe styles
            if (clonedElement instanceof HTMLElement) {
              clonedElement.style.all = 'initial';
              clonedElement.style.backgroundColor = '#ffffff';
              clonedElement.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)';
              clonedElement.style.position = 'relative';
            }
          }
        });

        const imgData = canvas.toDataURL('image/png', 1.0); // Maximum quality
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4',
          compress: false // Don't compress for better quality
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        // Center the image and maintain aspect ratio
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = (pdfHeight - imgHeight * ratio) / 2;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
        pdf.save(`certificate-${user.fname}-${user.lname}.pdf`);
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert(`Failed to generate certificate: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div 
        ref={certificateRef}
        id="certificate-content"
        style={{
          backgroundColor: '#ffffff',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
          width: '1100px', // Fixed width for consistent PDF output
          minHeight: '780px', // A4 landscape aspect ratio
          padding: '60px 80px',
          borderRadius: '0.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '12px solid #dbeafe',
          position: 'relative',
          overflow: 'hidden',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        {/* Decorative background elements */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          left: '-40px',
          width: '140px',
          height: '140px',
          backgroundColor: '#bfdbfe',
          borderRadius: '50%',
          opacity: 0.2,
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-50px',
          right: '-50px',
          width: '180px',
          height: '180px',
          backgroundColor: '#e9d5ff',
          borderRadius: '50%',
          opacity: 0.2,
        }}></div>
        
        {/* Header with Logos */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '40px', 
          position: 'relative', 
          zIndex: 10 
        }}>
          <div style={{ width: '110px', height: '110px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/Factcheck_Elections.png"
              alt="Factcheck Africa"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          
          <div style={{ width: '110px', height: '110px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/bbydi.png"
              alt="BBYDI"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Certificate Title */}
        <div style={{ textAlign: 'center', marginBottom: '35px', position: 'relative', zIndex: 10 }}>
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '0',
            marginTop: '0',
            fontFamily: 'Georgia, serif',
            letterSpacing: '0.02em'
          }}>
            Certificate of Completion
          </h1>
        </div>

        {/* Certificate Body */}
        <div style={{ textAlign: 'center', marginBottom: '35px', position: 'relative', zIndex: 10 }}>
          <p style={{ fontSize: '1.4rem', color: '#374151', marginBottom: '25px', marginTop: '0' }}>
            Presented to
          </p>
          
          <div style={{ 
            padding: '15px 0', 
            borderBottom: '3px solid #2563eb', 
            display: 'inline-block', 
            minWidth: '400px',
            marginBottom: '25px'
          }}>
            <p style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              color: '#2563eb',
              margin: '0',
              letterSpacing: '0.01em'
            }}>
              {user.fname} {user.lname}
            </p>
          </div>

          <div style={{ maxWidth: '850px', margin: '0 auto', paddingTop: '25px' }}>
            <p style={{ 
              fontSize: '1.15rem', 
              color: '#374151', 
              lineHeight: '1.8', 
              marginBottom: '15px',
              marginTop: '0'
            }}>
              This certifies that the above-named individual completed the <strong>Fact African Program</strong>, a 
              comprehensive training initiative dedicated to enhancing media literacy, critical thinking, critical 
              literacy, and ethical information verification skills.
            </p>
            <p style={{ fontSize: '1.15rem', color: '#374151', marginTop: '0', marginBottom: '0' }}>
              This program was developed in partnership by
            </p>
          </div>
        </div>

        {/* Partner Logos */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '60px', 
          marginBottom: '40px', 
          position: 'relative', 
          zIndex: 10 
        }}>
          <div style={{ width: '180px', height: '90px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/Factcheck_Elections.png"
              alt="Factcheck Africa"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <div style={{ width: '180px', height: '90px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/bbydi.png"
              alt="BBYDI"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Date and Signature */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'flex-end', 
          gap: '20px', 
          paddingTop: '20px', 
          position: 'relative', 
          zIndex: 10 
        }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              borderTop: '2px solid #9ca3af', 
              paddingTop: '8px', 
              minWidth: '220px' 
            }}>
              <p style={{ fontSize: '1.05rem', color: '#4b5563', margin: '0 0 6px 0' }}>
                Date: {formatDate(completionDate)}
              </p>
              <p style={{ 
                fontSize: '1.05rem', 
                color: '#374151', 
                fontWeight: '600', 
                margin: '0'
              }}>
                Director, BBYDI
              </p>
            </div>
          </div>
          
          <div style={{
            width: '70px',
            height: '70px',
            backgroundColor: '#3b82f6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '1.8rem',
            border: '5px solid #ffffff',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }}>
            B
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={handleDownload}
          style={{
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
        >
          <span style={{ fontSize: '1.2rem' }}>⬇</span>
          Download Certificate
        </button>
      </div>
    </div>
  );
};

export default CompletionCertificate;
