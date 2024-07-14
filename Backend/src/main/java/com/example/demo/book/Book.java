    package com.example.demo.book;

    import com.example.demo.category.Category;
    import com.example.demo.publisher.Publisher;
    import com.example.demo.status.Status;
    import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
    import com.fasterxml.jackson.annotation.JsonManagedReference;
    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Getter;
    import lombok.NoArgsConstructor;
    import lombok.Setter;

    import java.util.HashMap;
    import java.util.Map;

    @Getter
    @Setter
    @Entity
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    public class Book {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "book_id")
        private Long bookID;

        @Column(name = "book_name", nullable = false)
        private String bookName;

        @Column(name = "book_price", nullable = false)
        private Double bookPrice;

        @Column(name = "book_quantity")
        private Integer bookQuantity;

        @Column(name = "book_author")
        private String bookAuthor;

        @Column(name = "book_star")
        private Integer bookStar;

        private Integer page;
        private String language;

        @Lob
        @Column(name = "book_image")
        private String bookImage;

        @Lob
        @Column(name = "description",columnDefinition = "TEXT")
        private String description;


        @ManyToOne(fetch = FetchType.EAGER)
        @JoinColumn(name = "category_id", nullable = false)
        private Category category;

        //publisher
        @ManyToOne(fetch = FetchType.EAGER)
        @JoinColumn(name = "publisher_id", nullable = false)
        private Publisher publisher;

        @OneToOne(fetch = FetchType.EAGER)
        @JoinColumn(name = "status_id", nullable = false)
        private Status status;

        @Transient
        private Map<Long, Integer> voters = new HashMap<>(); // Để lưu phiếu bầu của người dùng

        public Map<Long, Integer> getVoters() {
            return voters;
        }

        public void setVoters(Map<Long, Integer> voters) {
            this.voters = voters;
        }
    }
