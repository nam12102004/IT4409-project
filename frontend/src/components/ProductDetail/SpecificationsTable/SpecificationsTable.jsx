import React, { useState } from "react";
import "./SpecificationsTable.css";

// Mapping tên specs tiếng Anh sang tiếng Việt
const specLabels = {
  processor: "CPU",
  cpu: "CPU",
  ram: "RAM",
  storage: "Ổ cứng",
  ssd: "SSD",
  graphics: "Card đồ họa",
  gpu: "Card đồ họa",
  display: "Màn hình",
  screen: "Màn hình",
  battery: "Pin",
  weight: "Trọng lượng",
  os: "Hệ điều hành",
  color: "Màu sắc",
  size: "Kích thước",
  material: "Chất liệu",
  connection: "Kết nối",
  warranty: "Bảo hành",
  name: "Tên",
  brand: "Thương hiệu",
};

// Lấy label hiển thị cho spec
const getSpecLabel = (key) => {
  return specLabels[key.toLowerCase()] || key;
};

/**
 * SpecificationsTable Component
 * Hiển thị bảng thông số kỹ thuật chi tiết của sản phẩm
 */
export const SpecificationsTable = ({ specifications }) => {
  const [expandedSections, setExpandedSections] = useState({});

  if (!specifications || Object.keys(specifications).length === 0) {
    return null;
  }

  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  // Tổ chức specs theo nhóm
  const organizeSpecs = (specs) => {
    // Nếu specs không phải object hoặc là null
    if (!specs || typeof specs !== "object") {
      return {};
    }

    // Nếu specs đã được tổ chức theo nhóm (có các key là object)
    const hasNestedObjects = Object.values(specs).some(
      (val) => val && typeof val === "object" && !Array.isArray(val)
    );

    if (hasNestedObjects) {
      return specs;
    }

    // Nếu specs là flat object (các value đều là primitive), không cần nhóm
    // Trả về trực tiếp mà không wrap trong "general"
    return { general: specs };
  };

  const organizedSpecs = organizeSpecs(specifications);

  const sectionLabels = {
    general: "Thông tin chung",
    display: "Màn hình",
    performance: "Hiệu năng",
    memory: "Bộ nhớ",
    connectivity: "Kết nối",
    battery: "Pin & sạc",
    camera: "Camera",
    design: "Thiết kế",
    audio: "Âm thanh",
    other: "Khác",
  };

  // Kiểm tra xem sectionData có phải là object hợp lệ không
  const isValidSection = (data) => {
    return data && typeof data === "object" && !Array.isArray(data);
  };

  return (
    <div className="specifications-table">
      <h2 className="specs-title">Thông số kỹ thuật</h2>

      <div className="specs-sections">
        {Object.entries(organizedSpecs)
          .filter(([sectionKey, sectionData]) => isValidSection(sectionData))
          .map(([sectionKey, sectionData]) => {
            const isExpanded = expandedSections[sectionKey] ?? true;
            const sectionLabel = sectionLabels[sectionKey] || sectionKey;

            // Lọc các entries có giá trị hợp lệ (không phải object, không rỗng)
            const validEntries = Object.entries(sectionData).filter(
              ([key, value]) =>
                value !== null &&
                value !== undefined &&
                typeof value !== "object" &&
                String(value).trim() !== ""
            );

            if (validEntries.length === 0) return null;

            return (
              <div key={sectionKey} className="spec-section">
                <button
                  className="section-header"
                  onClick={() => toggleSection(sectionKey)}
                >
                  <h3>{sectionLabel}</h3>
                  <span className={`arrow ${isExpanded ? "expanded" : ""}`}>
                    ▼
                  </span>
                </button>

                {isExpanded && (
                  <div className="section-content">
                    <table>
                      <tbody>
                        {validEntries.map(([key, value]) => (
                          <tr key={key}>
                            <td className="spec-label">{getSpecLabel(key)}</td>
                            <td className="spec-value">
                              {Array.isArray(value)
                                ? value.join(", ")
                                : String(value)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};
