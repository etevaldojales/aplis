<?php
class Medico {
    private $conn;
    private $table_name = "medicos";

    public $id;
    public $nome;
    public $CRM;
    public $UFCRM;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read() {
        $query = "SELECT id, nome, CRM, UFCRM FROM " . $this->table_name . " ORDER BY id ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " SET nome=:nome, CRM=:CRM, UFCRM=:UFCRM";
        $stmt = $this->conn->prepare($query);

        $this->nome = htmlspecialchars(strip_tags($this->nome));
        $this->CRM = htmlspecialchars(strip_tags($this->CRM));
        $this->UFCRM = htmlspecialchars(strip_tags($this->UFCRM));

        $stmt->bindParam(":nome", $this->nome);
        $stmt->bindParam(":CRM", $this->CRM);
        $stmt->bindParam(":UFCRM", $this->UFCRM);

        return $stmt->execute();
    }
}
?>